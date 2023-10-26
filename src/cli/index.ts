import { setTimeout } from "node:timers/promises";

import * as prompt from "@clack/prompts";
import color from "picocolors";

import OPTIONS from "~/json/options.json";
import { getPackageManager } from "~/utils/get-package-manager.js";
import { validateAppName } from "~/utils/validate-app-name.js";

export async function cli() {
	try {
		const packageManager = getPackageManager();

		prompt.intro(color.inverse("🏗  Scaffold.cli "));

		const results = await prompt.group(
			{
				name: () => {
					return prompt.text({
						message: "How should the project be called?",
						placeholder: "my-project",
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
			},
			{
				onCancel: ({ results }) => {
					prompt.cancel("Scaffold cancelled.");

					throw new Error("PROCESS_CANCELLED");
				},
			},
		);

		const spinner = prompt.spinner();
		spinner.start("Installing via npm");

		await setTimeout(3000);

		spinner.stop("Installed via npm");

		prompt.outro("You're all set!");

		await setTimeout(1000);
	} catch (error) {
		if (error instanceof Error && error.message === "PROCESS_CANCELLED") {
			return process.on("SIGINT", () => process.exit(0));
		} else throw error;
	}
}
