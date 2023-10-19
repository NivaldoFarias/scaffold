import * as esbuild from "esbuild";

build();

async function build() {
	try {
		await esbuild.build({
			banner: { js: "#!/usr/bin/env node" },
			platform: "node",
			target: "node20",
			outfile: "bin/scaffold.cjs",
			entryPoints: ["src/index.ts"],
			minify: true,
			bundle: true,
			sourcemap: true,
			treeShaking: true,
		});
	} catch (error) {
		console.error(error);

		process.on("SIGINT", () => process.exit(1));
	}
}
