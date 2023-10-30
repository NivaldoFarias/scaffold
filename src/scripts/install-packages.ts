import chalk from "chalk";
import ora from "ora";
import { Simplify } from "type-fest";

import { logger } from "~/utils/logger.js";

import { type InstallerOptions, type PackageInstallerMap } from "~/installers/index.js";

export type InstallPackagesOptions = Simplify<
	InstallerOptions & {
		packageInstallerMap: PackageInstallerMap;
	}
>;

/** This runs the installer for all the packages that the user has selected. */
export function installPackages(options: InstallPackagesOptions) {
	const { packageInstallerMap } = options;

	logger.info("Adding boilerplate...");

	for (const [name, pkg] of Object.entries(packageInstallerMap)) {
		if (!pkg.inUse) continue;

		const spinner = ora(`Boilerplating ${name}...`).start();

		pkg.installer(options);

		spinner.succeed(chalk.green(`Successfully setup boilerplate for ${chalk.green.bold(name)}`));
	}

	logger.info("");
}
