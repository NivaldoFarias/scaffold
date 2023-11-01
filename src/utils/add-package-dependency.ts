import path from "path";

import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

import packagesDependencies from "~/json/packages-dependencies.json";

export interface AddPackageDependencyOptions {
	dependencies: (keyof typeof packagesDependencies)[];
	projectDir: string;
	usesTypescript?: boolean;
}

export const addPackageDependency = ({
	dependencies,
	projectDir,
	usesTypescript = true,
}: AddPackageDependencyOptions) => {
	const packageJson = fs.readJSONSync(path.join(projectDir, "package.json")) as PackageJson;

	const dependencyVersionMap = dependencies
		.map((dependency) => packagesDependencies[dependency])
		.flat();

	for (const pkg of dependencyVersionMap) {
		if (!packageJson.devDependencies) packageJson.devDependencies = {};
		if (!packageJson.dependencies) packageJson.dependencies = {};

		if (pkg.dev) packageJson.devDependencies[pkg.name] = pkg.version;
		else packageJson.dependencies[pkg.name] = pkg.version;

		if (usesTypescript) {
			const types = "types" in pkg ? pkg.types : undefined;

			if (types) packageJson.devDependencies[types.name] = types.version;
		}
	}

	const sortedPkgJson = sortPackageJson(packageJson);

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 2,
	});
};
