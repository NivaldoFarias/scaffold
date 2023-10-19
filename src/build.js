import * as esbuild from "esbuild";

build();

async function build() {
	try {
		await esbuild.build({
			platform: "node",
			target: "node18",
			outfile: "bin/scaffold.cjs",
			entryPoints: ["src/index.ts"],
			banner: { js: "#!/usr/bin/env node" },
			minify: true,
			bundle: true,
			treeShaking: true,
		});
	} catch (error) {
		console.error(error);

		process.on("SIGINT", () => process.exit(1));
	}
}
