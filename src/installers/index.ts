import type { PackageManager } from "~/utils/get-package-manager.js";

import type packagesDependencies from "~/json/packages-dependencies.json";

import { eslintInstaller } from "~/installers/eslint.js";
import { prettierInstaller } from "~/installers/prettier.js";
import { prismaInstaller } from "~/installers/prisma.js";

export type AvailablePackages = keyof typeof packagesDependencies;

export interface InstallerOptions {
	projectDir: string;
	projectName: string;
	pkgManager: PackageManager;
	installDependencies: boolean;
	packages: PackageInstallerMap;
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
		eslint: {
			inUse: packages.includes("eslint"),
			installer: eslintInstaller,
		},
		prettier: {
			inUse: packages.includes("prettier"),
			installer: prettierInstaller,
		},
	};
}
