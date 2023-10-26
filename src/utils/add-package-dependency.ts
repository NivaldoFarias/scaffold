import path from "path";

import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

import dependencyVersionMap from "~/json/dependency-versions.json";

export interface AddPackageDependencyOptions {
	dependencies: (keyof typeof dependencyVersionMap)[];
	projectDir: string;
	devMode: boolean;
}

export const addPackageDependency = ({
	dependencies,
	projectDir,
	devMode,
}: AddPackageDependencyOptions) => {
	const pkgJson = fs.readJSONSync(path.join(projectDir, "package.json")) as PackageJson;

	for (const pkgName of dependencies) {
		const version = dependencyVersionMap[pkgName];

		if (devMode && pkgJson.devDependencies) {
			pkgJson.devDependencies[pkgName] = version;
		} else if (pkgJson.dependencies) {
			pkgJson.dependencies[pkgName] = version;
		}
	}

	const sortedPkgJson = sortPackageJson(pkgJson);

	fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
		spaces: 4,
	});
};
