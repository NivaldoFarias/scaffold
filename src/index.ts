import { cli } from "src/cli/index.js";

cli().catch((error) => {
	console.error(error);
});
