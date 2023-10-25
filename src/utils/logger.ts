/* eslint-disable no-console */
import chalk from "chalk";

export const logger = {
	info: (...args: unknown[]) => console.log(chalk.blue(...args)),
	warn: (...args: unknown[]) => console.log(chalk.yellow(...args)),
	error: (...args: unknown[]) => console.log(chalk.red(...args)),
	success: (...args: unknown[]) => console.log(chalk.green(...args)),
};
