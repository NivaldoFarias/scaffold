import path from "node:path";
import process from "node:process";

import * as prompt from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";

import type { cli } from "~/cli/index.js";
import { PKG_ROOT } from "~/consts.js";

/** Bootstraps a new project based on the user's input. */
export async function scaffoldProject(results: NonNullable<Awaited<ReturnType<typeof cli>>>) {
	const projectDir = path.resolve(process.cwd(), results.projectName);
	const srcDir = path.join(PKG_ROOT, `templates/base/${results.language}`);

	if (!results.installDependencies) {
		prompt.note(`\nUsing: ${chalk.cyan.bold(results.packageManager)}\n`);
	} else {
		prompt.note("");
	}

	const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start();

	try {
		if (fs.existsSync(projectDir)) {
			if (fs.readdirSync(projectDir).length === 0) {
				spinner.info(
					`${chalk.cyan.bold(results.projectName)} exists but is empty, continuing...\n`,
				);
			} else {
				spinner.stopAndPersist();

				const overwriteDir = await prompt.select({
					message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
						results.projectName,
					)} already exists and isn't empty. How would you like to proceed?`,
					options: [
						{
							label: "Abort installation (recommended)",
							value: "abort",
						},
						{
							label: "Clear the directory and continue installation",
							value: "clear",
						},
						{
							label: "Continue installation and overwrite conflicting files",
							value: "overwrite",
						},
					],
					initialValue: "abort",
				});

				if (overwriteDir === "abort") {
					spinner.fail("Aborting installation...");
					process.exit(1);
				}

				const overwriteAction =
					overwriteDir === "clear" ? "clear the directory" : "overwrite conflicting files";

				const confirmOverwriteDir = await prompt.confirm({
					message: `Are you sure you want to ${overwriteAction}?`,
					initialValue: false,
				});

				if (!confirmOverwriteDir) {
					spinner.fail("Aborting installation...");
					process.exit(1);
				}

				if (overwriteDir === "clear") {
					spinner.info(`Emptying ${chalk.cyan.bold(results.projectName)} and creating t3 app..\n`);
					fs.emptyDirSync(projectDir);
				}
			}
		}

		spinner.start();

		fs.copySync(srcDir, projectDir);
		fs.renameSync(path.join(projectDir, "_gitignore"), path.join(projectDir, ".gitignore"));

		spinner.succeed(
			`${chalk.cyan.bold(results.projectName)} ${chalk.green("scaffolded successfully!")}\n`,
		);

		return projectDir;
	} catch (error) {
		spinner.fail(`${chalk.redBright.bold("An error has ocurred. Stoping installation...")}\n`);

		throw error;
	}
}
