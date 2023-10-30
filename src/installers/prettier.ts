import path from "path";

import fs from "fs-extra";
import type { Config as PrettierConfig } from "prettier";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import prettierConfigOptions from "~/json/prettier-config-options.json";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export type PrettierPluginPackages = Extract<AvailablePackages, `prettier-plugin-${string}`>;

export const prettierInstaller: Installer = ({
	language,
	projectDir,
	environment,
	packageInstallerMap,
}) => {
	const plugins = Object.entries(packageInstallerMap)
		.filter(([pkgName, pkgValue]) => pkgName.includes("prettier-plugin") && pkgValue.inUse)
		.map(([pkgName]) => pkgName) as PrettierPluginPackages[];

	addPackageDependency({
		projectDir,
		dependencies: ["prettier", ...plugins],
	});

	const prettierConfigPath = path.join(PKG_ROOT, "templates/packages/.prettierrc.json");
	const packageJsonPath = path.join(projectDir, "package.json");

	const [prettierConfig, packageJson] = [
		fs.readJSONSync(prettierConfigPath),
		fs.readJSONSync(packageJsonPath),
	] as [PrettierConfig, PackageJson];

	const prettierConfigDest = path.join(projectDir, ".prettierrc.json");

	fs.writeJSON(prettierConfigDest, buildPrettierConfig(prettierConfig), {
		spaces: 2,
	});
	fs.writeJSON(packageJsonPath, buildFormattingScript(packageJson), {
		spaces: 2,
	});

	function buildPrettierConfig(config: PrettierConfig) {
		if (environment === "browser" || environment === "both") {
			config = {
				...config,
				...(prettierConfigOptions.browser as PrettierConfig),
			};
		}

		if (plugins.length > 0) {
			config = {
				...config,
				plugins,
			};

			if (plugins.some((plugin) => plugin in prettierConfigOptions.plugins)) {
				for (const plugin of plugins) {
					if (!(plugin in prettierConfigOptions.plugins)) continue;

					config = {
						...config,
						...prettierConfigOptions.plugins[plugin],
					};
				}
			}
		}

		return config;
	}

	function buildFormattingScript(pkgJson: PackageJson) {
		const extensions = {
			typescript: `,ts,tsx`,
			javascript: `,jsx`,
			both: `,jsx,ts,tsx`,
		};

		pkgJson.scripts = {
			...pkgJson.scripts,
			format: `prettier --write '**/*.{json,js,cjs,mjs${extensions[language]}}'`,
		};

		return pkgJson;
	}
};
