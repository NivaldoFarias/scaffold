import app from "./app/index.ts";

execute();

async function execute() {
	try {
		await app();
	} catch (error) {
		console.error(error);
	}
}
