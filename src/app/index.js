import { setTimeout } from "node:timers/promises";

import * as cli from "@clack/prompts";
import color from "picocolors";

export async function app() {
	cli.intro(color.inverse("Scaffold CLI"));

	const name = await cli.text({
		message: "What is the name of the project?",
		placeholder: "my-project",
	});

	if (cli.isCancel(name)) {
		cli.cancel("Operation cancelled");

		return process.on("SIGINT", () => process.exit(0));
	}

	const shouldContinue = await cli.confirm({
		message: "Do you want to continue?",
	});

	if (cli.isCancel(shouldContinue)) {
		cli.cancel("Operation cancelled");

		return process.on("SIGINT", () => process.exit(0));
	}

	const projectType = await cli.select({
		message: "Pick a project type.",
		options: [
			{ value: "ts", label: "TypeScript" },
			{ value: "js", label: "JavaScript" },
		],
	});

	if (cli.isCancel(projectType)) {
		cli.cancel("Operation cancelled");

		return process.on("SIGINT", () => process.exit(0));
	}

	const spinner = cli.spinner();
	spinner.start("Installing via npm");

	await setTimeout(3000);

	spinner.stop("Installed via npm");

	cli.outro("You're all set!");

	await setTimeout(1000);
}
