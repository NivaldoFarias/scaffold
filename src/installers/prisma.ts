import path from "path";

import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import { PKG_ROOT } from "~/consts.js";
import type { Installer } from "~/installers/index.js";

export const prismaInstaller: Installer = ({ projectDir, packages }) => {
	addPackageDependency({
		projectDir,
		dependencies: ["prisma"],
		devMode: true,
	});
	addPackageDependency({
		projectDir,
		dependencies: ["@prisma/client"],
		devMode: false,
	});

	const templatePkgsDir = path.join(PKG_ROOT, "templates/packages");

	const schemaSrc = path.join(
		templatePkgsDir,
		"prisma/schema",
		packages?.nextAuth.inUse ? "with-auth.prisma" : "base.prisma",
	);
	const schemaDest = path.join(projectDir, "prisma/schema.prisma");

	const clientSrc = path.join(templatePkgsDir, "src/server/db/db-prisma.ts");
	const clientDest = path.join(projectDir, "src/server/db.ts");

	const packageJsonPath = path.join(projectDir, "package.json");

	const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;

	packageJsonContent.scripts = {
		...packageJsonContent.scripts,
		"postinstall": "prisma generate",
		"db:push": "prisma db push",
		"db:studio": "prisma studio",
	};

	fs.copySync(schemaSrc, schemaDest);
	fs.copySync(clientSrc, clientDest);
	fs.writeJSONSync(packageJsonPath, packageJsonContent, {
		spaces: 2,
	});
};
