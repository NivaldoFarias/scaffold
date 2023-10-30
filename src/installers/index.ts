import type { PackageManager } from "~/utils/get-package-manager.js";

import type packagesDependencies from "~/json/packages-dependencies.json";

import { eslintInstaller } from "~/installers/eslint.js";
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
	[Package in AvailablePackages]: {
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
		"next-auth": {
			inUse: packages.includes("next-auth"),
			installer: () => {},
		},
		"eslint-plugin-prettier": {
			inUse: packages.includes("eslint-plugin-prettier"),
			installer: () => {},
		},
		"eslint-plugin-angular": {
			inUse: packages.includes("eslint-plugin-angular"),
			installer: () => {},
		},
		"eslint-plugin-nestjs": {
			inUse: packages.includes("eslint-plugin-nestjs"),
			installer: () => {},
		},
		"eslint-plugin-next": {
			inUse: packages.includes("eslint-plugin-next"),
			installer: () => {},
		},
		"eslint-plugin-react": {
			inUse: packages.includes("eslint-plugin-react"),
			installer: () => {},
		},
		"eslint-plugin-typescript": {
			inUse: packages.includes("eslint-plugin-typescript"),
			installer: () => {},
		},
		"eslint-plugin-vue": {
			inUse: packages.includes("eslint-plugin-vue"),
			installer: () => {},
		},
		"prettier-plugin-jsdoc": {
			inUse: packages.includes("prettier-plugin-jsdoc"),
			installer: () => {},
		},
		"prettier-plugin-prisma": {
			inUse: packages.includes("prettier-plugin-prisma"),
			installer: () => {},
		},
		"prettier-plugin-imports": {
			inUse: packages.includes("prettier-plugin-imports"),
			installer: () => {},
		},
		"styled-components": {
			inUse: packages.includes("styled-components"),
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
		"next": {
			inUse: packages.includes("next"),
			installer: () => {},
		},
		"passport": {
			inUse: packages.includes("passport"),
			installer: () => {},
		},
		"react": {
			inUse: packages.includes("react"),
			installer: () => {},
		},
		"sass": {
			inUse: packages.includes("sass"),
			installer: () => {},
		},
		"sequelize": {
			inUse: packages.includes("sequelize"),
			installer: () => {},
		},
		"tailwindcss": {
			inUse: packages.includes("tailwindcss"),
			installer: () => {},
		},
		"typeorm": {
			inUse: packages.includes("typeorm"),
			installer: () => {},
		},
		"vue": {
			inUse: packages.includes("vue"),
			installer: () => {},
		},
		"stylelint-plugin-sass": {
			inUse: packages.includes("stylelint-plugin-sass"),
			installer: () => {},
		},
		"stylelint-plugin-styled-components": {
			inUse: packages.includes("stylelint-plugin-styled-components"),
			installer: () => {},
		},
		"stylelint": {
			inUse: packages.includes("stylelint"),
			installer: () => {},
		},
	};
}
