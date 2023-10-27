import { cli } from "~/cli/index.js";
import { buildPackageInstallerMap } from "~/installers/index.js";
import { scaffoldProject } from "~/scripts/scaffold-project.js";

import { installPackages } from "./scripts/install-packages.js";

exec().catch((error) => {
	console.error(error);
});

async function exec() {
	const results = await cli();
	if (!results) return;

	const packages = buildPackageInstallerMap(results.packages);

	const projectDir = await scaffoldProject(results);

	installPackages({
		...results,
		packages,
		projectDir,
	});
}
