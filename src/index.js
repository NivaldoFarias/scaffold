import { app } from "src/app/index.js";

execute();

async function execute() {
	try {
		await app();
	} catch (error) {
		console.error(error);
	}
}
