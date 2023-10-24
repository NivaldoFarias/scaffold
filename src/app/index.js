import { setTimeout } from "node:timers/promises";

import * as cli from "@clack/prompts";
import color from "picocolors";

import { ENVIRONMENTS, FRAMEWORKS, LANGUAGES, ORM, TOOLING, TOOLING_PLUGINS } from "./data.js";

export async function app() {
	cli.intro(color.inverse("🏗  Scaffold"));

	const results = await cli.group(
		{
			name: () => {
				return cli.text({
					message: "How should the project be called?",
					placeholder: "my-project",
				});
			},
			environment: ({ results }) => {
				return cli.select({
					message: "What environment will the project run in?",
					options: ENVIRONMENTS,
				});
			},
			framework: ({ results: { environment } }) => {
				return cli.select({
					message: "Which framework do you wish to use?",
					options: FRAMEWORKS[/** @type {keyof typeof FRAMEWORKS} */ (environment)],
				});
			},
			language: ({ results }) => {
				return cli.select({
					message: "What language do you wish to use?",
					options: LANGUAGES,
				});
			},
			orm: ({ results: { language } }) => {
				return cli.select({
					message: "Which ORM do you wish to use?",
					options: ORM[/** @type {keyof typeof ORM} */ (language)],
				});
			},
			tooling: ({ results }) => {
				return cli.multiselect({
					message: "Which toolings do you wish to use, if any?",
					options: TOOLING,
					required: false,
				});
			},
			plugins: ({ results: { language, tooling, framework, orm } }) => {
				if (!tooling || !Array.isArray(tooling) || tooling.length === 0) {
					cli.note(
						"No tooling selected. Skipping plugin selection. You can always add plugins later.",
					);

					return;
				}

				const options = [];

				if (tooling.includes("eslint")) {
					if (language === "typescript") {
						options.push(...TOOLING_PLUGINS.eslint.typescript);
					}

					if (typeof framework === "string" && framework in TOOLING_PLUGINS.eslint) {
						options.push(
							...TOOLING_PLUGINS.eslint[
								/** @type {keyof typeof TOOLING_PLUGINS["eslint"]} */ (framework)
							],
						);
					}
				}

				if (tooling.includes("prettier")) {
					if (language === "javascript") {
						options.push(...TOOLING_PLUGINS.prettier.javascript);
					}

					if (orm === "prisma") {
						options.push(...TOOLING_PLUGINS.prettier.prisma);
					}
				}

				return cli.multiselect({
					message: "Which plugins do you want to use?",
					required: false,
					options,
				});
			},
		},
		{
			onCancel: ({ results }) => {
				cli.cancel("Operation cancelled");

				return process.on("SIGINT", () => process.exit(0));
			},
		},
	);

	if (
		typeof results.environment === "string" &&
		typeof results.framework === "string" &&
		typeof results.language === "string" &&
		typeof results.orm === "string"
	) {
		cli.note(
			`You have selected ${color.bold(
				results.name,
			)} as the name for your project, which will run in ${color.bold(
				results.environment,
			)} using ${color.bold(results.framework)} with ${color.bold(
				results.language,
			)} and ${color.bold(results.orm)} as the ORM.`,
		);
	}

	const spinner = cli.spinner();
	spinner.start("Installing via npm");

	await setTimeout(3000);

	spinner.stop("Installed via npm");

	cli.outro("You're all set!");

	await setTimeout(1000);
}
