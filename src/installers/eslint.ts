import path from "path";

import type { Linter } from "eslint";
import fs from "fs-extra";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import eslintConfigOptions from "~/json/eslint-config-options.json";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export type ESLintPluginPackages = Extract<AvailablePackages, `eslint-plugin-${string}`>;

export const eslintInstaller: Installer = ({
	language,
	projectDir,
	environment,
	packageInstallerMap,
}) => {
	const plugins = Object.entries(packageInstallerMap)
		.filter(([pkgName, pkgValue]) => pkgName.includes("eslint-plugin") && pkgValue.inUse)
		.map(([pkgName]) => pkgName) as ESLintPluginPackages[];

	addPackageDependency({
		projectDir,
		dependencies: ["eslint", ...plugins],
		usesTypescript: language === "typescript" || language === "both",
	});

	const eslintConfigPath = path.join(PKG_ROOT, `templates/packages/eslint/.eslintrc.json`);
	const packageJsonPath = path.join(projectDir, "package.json");

	const [eslintConfig, packageJson] = [
		fs.readJSONSync(eslintConfigPath),
		fs.readJSONSync(packageJsonPath),
	] as [Linter.Config, PackageJson];

	const eslintConfigDest = path.join(projectDir, ".eslintrc.json");

	fs.writeJSON(eslintConfigDest, buildEslintConfig(eslintConfig), {
		spaces: 2,
	});
	fs.writeJSONSync(packageJsonPath, buildLintingScript(packageJson), {
		spaces: 2,
	});

	function buildEslintConfig(config: Linter.Config) {
		config.env = {
			...config.env,
			...eslintConfigOptions.env[environment],
		};

		if (plugins.includes("eslint-plugin-vue")) {
			config.parser = eslintConfigOptions.parser["eslint-plugin-vue"];

			if (plugins.includes("eslint-plugin-typescript")) {
				config.parserOptions = {
					...config.parserOptions,
					...(eslintConfigOptions.parserOptions[
						"eslint-plugin-vue-with-typescript"
					] as Linter.ParserOptions),
				};
			} else {
				config.parserOptions = {
					...config.parserOptions,
					...(eslintConfigOptions.parserOptions[
						"eslint-plugin-vue-without-typescript"
					] as Linter.ParserOptions),
				};
			}
		} else if (plugins.includes("eslint-plugin-typescript")) {
			config.parser = eslintConfigOptions.parser["eslint-plugin-typescript"];
			config.parserOptions = {
				...config.parserOptions,
				...(eslintConfigOptions.parserOptions["eslint-plugin-typescript"] as Linter.ParserOptions),
			};
		}

		if (plugins.includes("eslint-plugin-nestjs")) {
			if (!config.plugins) config.plugins = [];

			config.plugins = [...config.plugins, "@darraghor/nestjs-typed"];
		}

		if (plugins.includes("eslint-plugin-angular")) {
			if (!config.overrides) config.overrides = [];

			config.overrides.push(
				...(eslintConfigOptions.overrides["eslint-plugin-angular"] as Linter.ConfigOverride[]),
			);
		}

		for (const plugin of plugins) {
			if (!config.extends) config.extends = [];
			else if (typeof config.extends === "string") config.extends = [config.extends];

			config.extends.push(...eslintConfigOptions.extends[plugin]);
		}

		return config;
	}

	function buildLintingScript(pkgJson: PackageJson) {
		const htmlPlugins: ESLintPluginPackages[] = [
			"eslint-plugin-angular",
			"eslint-plugin-next",
			"eslint-plugin-react",
		];

		const extensions = {
			typescript: `,ts,tsx`,
			javascript: `,jsx`,
			both: `,jsx,ts,tsx`,
		};

		let lintingScript = `eslint . --ext js,cjs,mjs${extensions[language]}`;

		if (plugins.some((plugin) => htmlPlugins.includes(plugin))) {
			lintingScript += `,html`;
		}

		if (plugins.includes("eslint-plugin-vue")) {
			lintingScript += `,vue`;
		}

		pkgJson.scripts = {
			...pkgJson.scripts,
			lint: lintingScript,
		};

		return pkgJson;
	}
};
