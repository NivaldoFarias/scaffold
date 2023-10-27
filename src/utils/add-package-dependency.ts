import path from "path";

import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

import packagesDependencies from "~/json/packages-dependencies.json";

export interface AddPackageDependencyOptions {
	dependencies: (keyof typeof packagesDependencies)[];
	projectDir: string;
}

export const addPackageDependency = ({ dependencies, projectDir }: AddPackageDependencyOptions) => {
	const packageJson = fs.readJSONSync(path.join(projectDir, "package.json")) as PackageJson;

	const dependencyVersionMap = dependencies
		.map((dependency) => packagesDependencies[dependency])
		.flat();

	for (const pkg of dependencyVersionMap) {
		if (pkg.dev) {
			if (!packageJson.devDependencies) packageJson.devDependencies = {};

			packageJson.devDependencies[pkg.name] = pkg.version;
		} else {
			if (!packageJson.dependencies) packageJson.dependencies = {};

			packageJson.dependencies[pkg.name] = pkg.version;
		}
	}

	const sortedPkgJson = sortPackageJson(packageJson);

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 2,
	});
};
