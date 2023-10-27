import path from "path";

import fs from "fs-extra";
import type { Config as PrettierConfig } from "prettier";
import type { PackageJson } from "type-fest";

import { addPackageDependency } from "~/utils/add-package-dependency.js";

import prettierConfig from "~/json/prettier-config.json";

import { PKG_ROOT } from "~/consts.js";
import type { AvailablePackages, Installer } from "~/installers/index.js";

export type PrettierPluginPackages = Extract<AvailablePackages, `prettier-plugin-${string}`>;

export const prettierInstaller: Installer = ({ projectDir, packages, environment, language }) => {
	const plugins = Object.keys(packages).filter((pkg) => {
		return pkg.includes("prettier-plugin");
	}) as PrettierPluginPackages[];

	addPackageDependency({
		projectDir,
		dependencies: ["prettier", ...plugins],
	});

	const prettierConfigPath = path.join(PKG_ROOT, "templates/packages/.prettierrc.json");
	const packageJsonPath = path.join(projectDir, "package.json");

	const [outputPrettierConfig, packageJsonContent] = [
		fs.readJSONSync(prettierConfigPath),
		fs.readJSONSync(packageJsonPath),
	] as [PrettierConfig, PackageJson];

	const prettierConfigDest = path.join(projectDir, ".prettierrc.json");

	fs.writeJSON(prettierConfigDest, buildPrettierConfig(outputPrettierConfig), {
		spaces: 2,
	});
	fs.writeJSON(packageJsonPath, buildFormattingScript(packageJsonContent), {
		spaces: 2,
	});

	function buildPrettierConfig(config: PrettierConfig) {
		if (environment === "browser" || environment === "both") {
			config = {
				...config,
				...(prettierConfig.browser as PrettierConfig),
			};
		}

		if (plugins.length > 0) {
			config = {
				...config,
				plugins,
			};

			if (plugins.some((plugin) => plugin in prettierConfig.plugins)) {
				for (const plugin of plugins) {
					if (!(plugin in prettierConfig.plugins)) continue;

					config = {
						...config,
						...prettierConfig.plugins[plugin],
					};
				}
			}
		}

		return config;
	}

	function buildFormattingScript(pkgJson: PackageJson) {
		let formattingScript = "prettier --write '**/*.{js,cjs,mjs";

		if (language === "typescript") {
			if (environment === "browser" || environment === "both") {
				formattingScript += `,tsx`;
			}

			formattingScript += `,ts`;
		} else if (environment === "browser" || environment === "both") {
			formattingScript += `,jsx`;
		}

		formattingScript += `}'`;

		pkgJson.scripts = {
			...pkgJson.scripts,
			format: formattingScript,
		};

		return pkgJson;
	}
};
