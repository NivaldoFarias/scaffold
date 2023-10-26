import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
	clean: true,
	entry: ["src/index.ts"],
	format: ["esm"],
	banner: {
		js: `#!/usr/bin/env node 
import { createRequire } from "module";
const require = createRequire(import.meta.url);`,
	},
	minify: !isDev,
	shims: true,
	target: "node18",
	cjsInterop: true,
	outDir: "dist",
	platform: "node",
	onSuccess: isDev ? "node dist/index.js" : undefined,
});
