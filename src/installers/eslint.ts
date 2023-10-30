import path from "path";

import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export type ESLintPluginPackages = Extract<AvailablePackages, `eslint-plugin-${string}`>;

export const eslintInstaller: Installer = ({ projectDir, packages, language }) => {
	const plugins = Object.keys(packages).filter((pkg) => {
		return pkg.includes("eslint-plugin");
	}) as ESLintPluginPackages[];

	addPackageDependency({
		projectDir,
		dependencies: ["eslint", ...plugins],
	});

	const templatePkgsDir = path.join(PKG_ROOT, "templates/packages");

	const schemaSrc = path.join(templatePkgsDir, "eslint");
	const schemaDest = path.join(projectDir, "eslint/.eslintrc.cjs");

	const packageJsonPath = path.join(projectDir, "package.json");
	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;

	fs.copySync(schemaSrc, schemaDest);

	fs.writeJSONSync(packageJsonPath, buildLintingScript(packageJsonContent), {
		spaces: 2,
	});

	function buildLintingScript(pkgJson: PackageJson) {
		const extensions = {
			typescript: `ts,tsx`,
			javascript: `,jsx`,
			both: `,jsx,ts,tsx`,
		};

		pkgJson.scripts = {
			...pkgJson.scripts,
			lint: `eslint . --ext js,cjs,mjs${extensions[language]}`,
		};

		return pkgJson;
	}
};
