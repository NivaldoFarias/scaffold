import { setTimeout } from "node:timers/promises";

import * as prompt from "@clack/prompts";
import color from "picocolors";

import OPTIONS from "~/json/options.json";
import validatePkgName from "~/utils/validate-npm-package-name.js";

export async function app() {
	try {
		prompt.intro(color.inverse("🏗  Scaffold "));

		const results = await prompt.group(
			{
				name: () => {
					return prompt.text({
						message: "How should the project be called?",
						placeholder: "my-project",
						validate: (value) => {
							const { validForNewPackages, errors, warnings } = validatePkgName(value);

							if (!validForNewPackages) {
								if (errors.length + warnings.length === 1) {
									return errors.concat(warnings).join("\n");
								} else {
									return (
										"\n" +
										errors
											.concat(warnings)
											.map((txt, index) => `${index + 1}. ${txt}`)
											.join("\n")
									);
								}
							}
						},
					});
				},
				environment: ({ results }) => {
					return prompt.select({
						message: "What environment will the project run in?",
						options: OPTIONS.ENVIRONMENTS,
					});
				},
				framework: ({ results: { environment } }) => {
					return prompt.select({
						message: "Which framework do you wish to use?",
						options: OPTIONS.FRAMEWORKS[environment as keyof typeof OPTIONS.FRAMEWORKS],
					});
				},
				language: ({ results }) => {
					return prompt.select({
						message: "What language do you wish to use?",
						options: OPTIONS.LANGUAGES,
					});
				},
				orm: ({ results: { language } }) => {
					return prompt.select({
						message: "Which ORM do you wish to use?",
						options: OPTIONS.ORM[language as keyof typeof OPTIONS.ORM],
					});
				},
				tooling: ({ results }) => {
					return prompt.multiselect({
						message: "Which toolings do you wish to use, if any?",
						options: OPTIONS.TOOLING,
						required: false,
					});
				},
				plugins: ({ results: { language, tooling, framework, orm } }) => {
					if (!tooling || !Array.isArray(tooling) || tooling.length === 0) {
						prompt.note(
							"No tooling selected. Skipping plugin selection. You can always add plugins later.",
						);

						return;
					}

					const options = [];

					if (tooling.includes("eslint")) {
						if (language === "typescript") {
							options.push(...OPTIONS.TOOLING_PLUGINS.eslint.typescript);
						}

						if (typeof framework === "string" && framework in OPTIONS.TOOLING_PLUGINS.eslint) {
							options.push(
								...OPTIONS.TOOLING_PLUGINS.eslint[
									framework as keyof (typeof OPTIONS.TOOLING_PLUGINS)["eslint"]
								],
							);
						}
					}

					if (tooling.includes("prettier")) {
						if (language === "javascript") {
							options.push(...OPTIONS.TOOLING_PLUGINS.prettier.javascript);
						}

						if (orm === "prisma") {
							options.push(...OPTIONS.TOOLING_PLUGINS.prettier.prisma);
						}
					}

					return prompt.multiselect({
						message: "Which plugins do you want to use?",
						required: false,
						options,
					});
				},
			},
			{
				onCancel: ({ results }) => {
					prompt.cancel("Operation cancelled");

					throw new Error("PROCESS_CANCELLED");
				},
			},
		);

		if (
			typeof results.environment === "string" &&
			typeof results.framework === "string" &&
			typeof results.language === "string" &&
			typeof results.orm === "string"
		) {
			prompt.note(
				`You have selected ${color.bold(results.environment)} with ${color.bold(
					results.framework,
				)} and ${color.bold(results.language)} with ${color.bold(results.orm)} as the ORM.`,
			);
		}

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
