/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		"prettier",
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
	],
	plugins: ["@typescript-eslint"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	env: {
		es2023: true,
		amd: true,
		worker: true,
		serviceworker: true,
		webextensions: true,
		node: true,
		browser: true,
	},
	rules: {
		/* eslint */
		"prefer-const": "error",
		"no-console": ["error", { allow: ["warn", "error"] }],

		/* @typescript-eslint */
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "inline-type-imports" },
		],
		"@typescript-eslint/no-confusing-void-expression": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
	},
};
