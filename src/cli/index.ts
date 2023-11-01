import * as prompt from "@clack/prompts";
import color from "picocolors";

import { getPackageManager, PackageManager } from "~/utils/get-package-manager.js";
import { IsTTYError } from "~/utils/is-tty-error.js";
import { logger } from "~/utils/logger.js";
import { validateAppName } from "~/utils/validate-app-name.js";

import OPTIONS from "~/json/alt-options.json";
import DEFAULTS from "~/json/defaults.json";

import type { AvailablePackages } from "~/installers/index.js";

export type CliResults = {
	packages: AvailablePackages[];
	packageManager: PackageManager;
	projectName: string;
	language: "typescript" | "javascript" | "both";
	environment: "node" | "browser" | "both";
	importAlias: string;
	gitInit: boolean;
	installDependencies: boolean;
};

export async function cli() {
	try {
		if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
			logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are 
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you 
  can provide the arguments from the CLI directly to skip the prompts.`);

			throw new IsTTYError("Non-interactive environment");
		}

		const packageManager = getPackageManager();

		prompt.intro(color.inverse(DEFAULTS.app_intro));

		const project = await prompt.group(
			{
				name: () => {
					return prompt.text({
						message: "How should the project be called?",
						defaultValue: process.argv[0] ?? DEFAULTS.project_name,
						placeholder: DEFAULTS.project_name,
						validate: validateAppName,
					});
				},
				environment: ({ results }) => {
					return prompt.select({
						message: OPTIONS.environments.prompt,
						options: OPTIONS.environments.options,
					});
				},
				presets: ({ results: { environment } }) => {
					let options =
						OPTIONS.presets.options[environment as keyof typeof OPTIONS.presets.options];

					return prompt.select({
						message: OPTIONS.presets.prompt,
						options,
					});
				},
				git: ({ results }) => {
					return prompt.confirm({
						message: "Initialize a Git repository and stage the changes?",
						initialValue: true,
					});
				},
				install: ({ results }) => {
					return prompt.confirm({
						message:
							`Install dependencies via '${packageManager}` +
							(packageManager === "yarn" ? `'?` : ` install'?`),
						initialValue: true,
					});
				},
			},
			{
				onCancel: ({ results }) => {
					prompt.cancel("Scaffold cancelled.");

					throw new Error("PROCESS_CANCELLED");
				},
			},
		);

		const packages: string[] = [];

		for (const [key, value] of Object.entries(project)) {
			switch (key as keyof typeof project) {
				case "presets": {
					if (typeof value === "string" && value !== "none") {
						packages.push(value);
					}

					break;
				}
				default: {
					break;
				}
			}
		}

		if (packages.includes("prettier") && packages.includes("eslint")) {
			packages.push("eslint-plugin-prettier");
		}

		return {
			packages,
			packageManager,
			environment: project.environment,
			projectName: project.name,
			gitInit: project.git === true,
			installDependencies: project.install === true,
		} as CliResults;
	} catch (error) {
		// ! If the user is not calling the cli from an interactive terminal,
		// ! inquirer will throw an IsTTYError.
		// ! If this happens, we catch the error, tell the user what has happened,
		// ! and then continue to run the program with a default app

		if (error instanceof IsTTYError) {
			logger.warn(`scaffold.cli needs an interactive terminal to provide options`);

			const shouldContinue = await prompt.confirm({
				message: `Continue scaffolding a default app?`,
				initialValue: true,
			});

			if (!shouldContinue) {
				logger.info("Exiting...");
				process.exit(0);
			}

			logger.info(`Bootstrapping a default app in ./${DEFAULTS.project_name}`);
		} else if (error instanceof Error && error.message === "PROCESS_CANCELLED") {
			process.exit(0);
		} else throw error;
	}
}
