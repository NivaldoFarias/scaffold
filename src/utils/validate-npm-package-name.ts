import semver from "semver";

const IGNORE_LIST = ["node_modules", "favicon.ico"];

const PERMANENT_MODULES = [
	"assert",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"dns",
	"domain",
	"events",
	"fs",
	"http",
	"https",
	"module",
	"net",
	"os",
	"path",
	"punycode",
	"querystring",
	"readline",
	"repl",
	"stream",
	"string_decoder",
	"sys",
	"timers",
	"tls",
	"tty",
	"url",
	"util",
	"vm",
	"zlib",
];

const VERSION_LOCKED_MODULES = {
	"freelist": "<6.0.0",
	"v8": ">=1.0.0",
	"process": ">=1.1.0",
	"inspector": ">=8.0.0",
	"async_hooks": ">=8.1.0",
	"http2": ">=8.4.0",
	"perf_hooks": ">=8.5.0",
	"trace_events": ">=10.0.0",
	"worker_threads": ">=12.0.0",
	"node:test": ">=18.0.0",
};

const EXPERIMENTAL_MODULES = {
	worker_threads: ">=10.5.0",
	wasi: ">=12.16.0",
	diagnostics_channel: "^14.17.0 || >=15.1.0",
};

const REGEX = {
	SCOPED_PACKAGE_PATTERN: new RegExp("^(?:@([^/]+?)[/])?([^/]+?)$"),
	NO_LEADING_DOT: /^\..+$/,
	NO_LEADING_UNDERSCORE: /^_.*$/,
	SPECIAL_CHARACTERS: /[~'!()*]/,
};

export function validatePkgName(name: string | null | undefined) {
	const warnings: string[] = [];
	const errors: string[] = [];

	if (name === null) {
		errors.push("name cannot be null");
		return done(warnings, errors);
	} else if (name === undefined) {
		errors.push("name cannot be undefined");
		return done(warnings, errors);
	} else if (typeof name !== "string") {
		errors.push("name must be a string");
		return done(warnings, errors);
	}

	if (name.length === 0) {
		errors.push("name length must be greater than zero");
	}

	if (name.match(REGEX.NO_LEADING_DOT)) {
		errors.push("name cannot contain leading dot");
	}

	if (name.match(REGEX.NO_LEADING_UNDERSCORE)) {
		errors.push("name cannot contain leading underscores");
	}

	if (name.trim() !== name) {
		errors.push("name cannot contain leading or trailing spaces");
	}

	for (const ignore of IGNORE_LIST) {
		if (name.toLowerCase() === ignore) {
			errors.push(ignore + " is a blacklisted name");
		}
	}

	for (const builtin of builtins({ version: "*" })) {
		if (name.toLowerCase() === builtin) {
			warnings.push(builtin + " is a core module name");
		}
	}

	if (name.length > 214) {
		warnings.push("name can no longer contain more than 214 characters");
	}

	if (name.toLowerCase() !== name) {
		warnings.push("name can no longer contain capital letters");
	}

	if (REGEX.SPECIAL_CHARACTERS.test(name.split("/").slice(-1)[0])) {
		warnings.push('name can no longer contain special characters ("~\'!()*")');
	}

	if (encodeURIComponent(name) !== name) {
		const nameMatch = name.match(REGEX.SCOPED_PACKAGE_PATTERN);

		if (nameMatch) {
			const [_, user, pkg] = nameMatch;

			if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
				return done(warnings, errors);
			}
		}

		errors.push("name can only contain URL-friendly characters");
	}

	return done(warnings, errors);

	function done(warnings: string[], errors: string[]) {
		return {
			validForNewPackages: errors.length === 0 && warnings.length === 0,
			validForOldPackages: errors.length === 0,
			warnings,
			errors,
		};
	}

	function builtins({ version = process.version, experimental = false }) {
		const builtins = [...PERMANENT_MODULES];

		for (const [name, range] of Object.entries(VERSION_LOCKED_MODULES)) {
			if (version !== "*" && !semver.satisfies(version, range)) continue;

			builtins.push(name);
		}

		if (experimental) {
			for (const [name, range] of Object.entries(EXPERIMENTAL_MODULES)) {
				if (builtins.includes(name) || (version !== "*" && !semver.satisfies(version, range))) {
					continue;
				}

				builtins.push(name);
			}
		}

		return builtins;
	}
}
