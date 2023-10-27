import path from "path";

import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export type ESLintPluginPackages = Extract<AvailablePackages, `eslint-plugin-${string}`>;

export const eslintInstaller: Installer = ({ projectDir, packages }) => {
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

	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		lint: "eslint .",
	};

	fs.copySync(schemaSrc, schemaDest);

	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2,
	});
};
