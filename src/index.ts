import { cli } from "~/cli/index.js";
import { scaffoldProject } from "~/scripts/scaffold-project.js";

exec().catch((error) => {
	console.error(error);
});

async function exec() {
	const results = await cli();

	await scaffoldProject(results);
}
