import chalk from "chalk";
import ora from "ora";
import { Simplify } from "type-fest";

import { logger } from "~/utils/logger.js";

import { type InstallerOptions, type PackageInstallerMap } from "~/installers/index.js";

export type InstallPackagesOptions = Simplify<
	InstallerOptions & {
		packages: PackageInstallerMap;
	}
>;

/** This runs the installer for all the packages that the user has selected. */
export function installPackages(options: InstallPackagesOptions) {
	const { packages } = options;

	logger.info("Adding boilerplate...");

	for (const [name, packageOptions] of Object.entries(packages)) {
		if (packageOptions.inUse) {
			const spinner = ora(`Boilerplating ${name}...`).start();

			packageOptions.installer(options);

			spinner.succeed(chalk.green(`Successfully setup boilerplate for ${chalk.green.bold(name)}`));
		}
	}

	logger.info("");
}
