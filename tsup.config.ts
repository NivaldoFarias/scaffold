import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
	clean: true,
	entry: ["src/index.ts"],
	format: ["cjs"],
	banner: {
		js: "#!/usr/bin/env node",
	},
	minify: !isDev,
	target: "node18",
	outDir: "dist",
	platform: "node",
	onSuccess: isDev ? "node dist/index.js" : undefined,
});
