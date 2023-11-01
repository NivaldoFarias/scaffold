import type { PackageManager } from "~/utils/get-package-manager.js";

import type packagesDependencies from "~/json/packages-dependencies.json";

import { eslintInstaller } from "~/installers/eslint.js";
import { nextInstaller } from "~/installers/next.js";
import { prettierInstaller } from "~/installers/prettier.js";
import { prismaInstaller } from "~/installers/prisma.js";

export type AvailablePackages = keyof typeof packagesDependencies;

export interface InstallerOptions {
	projectDir: string;
	projectName: string;
	packageManager: PackageManager;
	installDependencies: boolean;
	packageInstallerMap: PackageInstallerMap;
	environment: "node" | "browser" | "both";
	language: "typescript" | "javascript" | "both";
}

export type Installer = (options: InstallerOptions) => void;

export type PackageInstallerMap = {
	[Package in Exclude<AvailablePackages, `${string}-plugin-${string}`>]: {
		inUse: boolean;
		installer: Installer;
	};
};

export function buildPackageInstallerMap(packages: AvailablePackages[]): PackageInstallerMap {
	return {
		"eslint": {
			inUse: packages.includes("eslint"),
			installer: eslintInstaller,
		},
		"prettier": {
			inUse: packages.includes("prettier"),
			installer: prettierInstaller,
		},
		"prisma": {
			inUse: packages.includes("prisma"),
			installer: prismaInstaller,
		},
		"next": {
			inUse: packages.includes("next"),
			installer: nextInstaller,
		},
		"react": {
			inUse: packages.includes("react"),
			installer: () => {},
		},
		"vue": {
			inUse: packages.includes("vue"),
			installer: () => {},
		},
		"styled-components": {
			inUse: packages.includes("styled-components"),
			installer: () => {},
		},
		"sass": {
			inUse: packages.includes("sass"),
			installer: () => {},
		},
		"tailwindcss": {
			inUse: packages.includes("tailwindcss"),
			installer: () => {},
		},
		"drizzle": {
			inUse: packages.includes("drizzle"),
			installer: () => {},
		},
		"express": {
			inUse: packages.includes("express"),
			installer: () => {},
		},
		"koa": {
			inUse: packages.includes("koa"),
			installer: () => {},
		},
		"mongoose": {
			inUse: packages.includes("mongoose"),
			installer: () => {},
		},
		"nestjs": {
			inUse: packages.includes("nestjs"),
			installer: () => {},
		},
		"sequelize": {
			inUse: packages.includes("sequelize"),
			installer: () => {},
		},
		"typeorm": {
			inUse: packages.includes("typeorm"),
			installer: () => {},
		},
		"stylelint": {
			inUse: packages.includes("stylelint"),
			installer: () => {},
		},
	};
}
