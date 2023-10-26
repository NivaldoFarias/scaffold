import type { PackageManager } from "~/utils/get-package-manager.js";

import { prismaInstaller } from "~/installers/prisma.js";

// Turning this into a const allows the list to be iterated over for programatically creating prompt options
// Should increase extensability in the future
export const availablePackages = [
	"nextAuth",
	"prisma",
	"drizzle",
	"eslint",
	"prettier",
	"next",
	"react",
	"nestjs",
	"angular",
	"svelte",
	"vue",
	"express",
	"passport",
	"typeorm",
	"sequelize",
	"mongoose",
	"@typescript-eslint/parser",
	"@typescript-eslint/eslint-plugin",
	"eslint-plugin-vue",
	"eslint-plugin-prettier-vue",
	"eslint-plugin-react",
	"eslint-plugin-react-hooks",
	"svelte-eslint-parser",
	"eslint-plugin-svelte",
	"eslint-plugin-next",
	"@angular-eslint/eslint-plugin",
	"@darraghor/eslint-plugin-nestjs-typed",
	"@ianvs/prettier-plugin-sort-imports",
	"prettier-plugin-jsdoc",
	"prettier-plugin-prisma",
] as const;

export type AvailablePackages = (typeof availablePackages)[number];

export interface InstallerOptions {
	projectDir: string;
	projectName: string;
	pkgManager: PackageManager;
	installDependencies: boolean;
	packages?: PackageInstallerMap;
}

export type Installer = (options: InstallerOptions) => void;

export type PackageInstallerMap = {
	[Package in AvailablePackages]: {
		inUse: boolean;
		installer: Installer;
	};
};

export function buildPackageInstallerMap(packages: AvailablePackages[]): PackageInstallerMap {
	return {
		prisma: {
			inUse: packages.includes("prisma"),
			installer: prismaInstaller,
		},
	};
}
