import { argv } from "node:process";

import * as prompt from "@clack/prompts";
import color from "picocolors";

import { getPackageManager } from "~/utils/get-package-manager.js";
import { validateAppName } from "~/utils/validate-app-name.js";
import { validateImportAlias } from "~/utils/validate-import-alias.js";

import DEFAULTS from "~/json/defaults.json";
import OPTIONS from "~/json/options.json";

export async function cli() {
	try {
		const pkgManager = getPackageManager();

		prompt.intro(color.inverse(DEFAULTS.app_intro));

		const project = await prompt.group(
			{
				name: () => {
					return prompt.text({
						message: "How should the project be called?",
						defaultValue: argv[0] ?? DEFAULTS.project_name,
						validate: validateAppName,
					});
				},
				environment: ({ results }) => {
					return prompt.select({
						message: "What environment will the project run in?",
						options: OPTIONS.environments,
					});
				},
				framework: ({ results: { environment } }) => {
					return prompt.select({
						message: "Which framework do you wish to use?",
						options: OPTIONS.frameworks[environment as keyof typeof OPTIONS.frameworks],
					});
				},
				language: ({ results }) => {
					return prompt.select({
						message: "What language do you wish to use?",
						options: OPTIONS.languages,
					});
				},
				authentication: ({ results: { language } }) => {
					return prompt.select({
						message: "Which authentication method do you wish to use?",
						options: OPTIONS.authentication[language as keyof typeof OPTIONS.authentication],
					});
				},
				database: ({ results: { language } }) => {
					return prompt.select({
						message: "Which database ORM do you wish to use?",
						options: OPTIONS.database[language as keyof typeof OPTIONS.database],
					});
				},
				tooling: ({ results }) => {
					return prompt.multiselect({
						message: "Which toolings do you wish to use, if any?",
						options: OPTIONS.tooling,
						required: false,
					});
				},
				plugins: ({ results: { language, tooling, framework, database } }) => {
					if (!tooling || !Array.isArray(tooling) || tooling.length === 0) {
						return prompt.note(
							"No tooling selected. Skipping plugin selection. You can always add plugins later.",
						);
					}

					const options = [];

					if (tooling.includes("eslint")) {
						if (language === "typescript") {
							options.push(...OPTIONS.tooling_plugins.eslint.typescript);
						}

						if (typeof framework === "string" && framework in OPTIONS.tooling_plugins.eslint) {
							options.push(
								...OPTIONS.tooling_plugins.eslint[
									framework as keyof typeof OPTIONS.tooling_plugins.eslint
								],
							);
						}
					}

					if (tooling.includes("prettier")) {
						options.push(
							...OPTIONS.tooling_plugins.prettier[
								language as keyof typeof OPTIONS.tooling_plugins.prettier
							],
						);

						if (database === "prisma") {
							options.push(...OPTIONS.tooling_plugins.prettier.prisma);
						}
					}

					return prompt.multiselect({
						message: "Which tooling plugins do you want to use?",
						required: false,
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
							`Install dependencies via '${pkgManager}` +
							(pkgManager === "yarn" ? `'?` : ` install'?`),
						initialValue: true,
					});
				},
				import: () => {
					return prompt.text({
						message: "What import alias would you like to use?",
						initialValue: DEFAULTS.import_alias,
						validate: validateImportAlias,
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
				case "language":
				case "database":
				case "framework":
				case "authentication": {
					if (typeof value === "string" && value !== "none") {
						packages.push(value);
					}

					break;
				}
				case "tooling":
				case "plugins": {
					if (Array.isArray(value) && value.length > 0) {
						packages.push(...(value as string[]));
					}

					break;
				}
				default: {
					break;
				}
			}
		}

		return {
			packages,
			pkgManager,
			projectName: project.name,
			language: project.language,
			importAlias: project.import,
			gitInit: project.git === true,
			installDependencies: project.install === true,
		};
	} catch (error) {
		if (error instanceof Error && error.message === "PROCESS_CANCELLED") {
			process.on("SIGINT", () => process.exit(0));
		} else throw error;
	}
}
