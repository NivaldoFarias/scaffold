import path from "path";

import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import { PKG_ROOT } from "~/consts.js";
import type { Installer } from "~/installers/index.js";

export const prismaInstaller: Installer = ({ projectDir, language }) => {
	addPackageDependency({
		projectDir,
		dependencies: ["prisma"],
		usesTypescript: language === "typescript" || language === "both",
	});

	const templatePkgsDir = path.join(PKG_ROOT, "templates/packages");

	const schemaSrc = path.join(templatePkgsDir, "prisma/schema.prisma");
	const schemaDest = path.join(projectDir, "prisma/schema.prisma");

	const packageJsonPath = path.join(projectDir, "package.json");
	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;

	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		"postinstall": "prisma generate",
		"db:push": "prisma db push",
		"db:studio": "prisma studio",
	};

	fs.copySync(schemaSrc, schemaDest);

	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2,
	});
};
