import path from "path";

import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export const prettierInstaller: Installer = ({ projectDir, packages }) => {
	const plugins = Object.keys(packages).filter((pkg) => {
		return pkg.includes("prettier-plugin") && packages[pkg as AvailablePackages].inUse;
	}) as AvailablePackages[];

	addPackageDependency({
		projectDir,
		dependencies: ["prettier", ...plugins],
	});

	const templatePkgsDir = path.join(PKG_ROOT, "templates/packages");

	const schemaSrc = path.join(templatePkgsDir, "prettier");
	const schemaDest = path.join(projectDir, "prettier/.prettierrc.cjs");

	const packageJsonPath = path.join(projectDir, "package.json");
	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;

	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		format: "prettier --write '**/*.{ts,tsx,js,jsx}'",
	};

	fs.copySync(schemaSrc, schemaDest);

	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2,
	});
};
