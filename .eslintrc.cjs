const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
	root: true,
	extends: [
		"prettier",
		"eslint:recommended",
		"plugin:unicorn/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	env: {
		es2023: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	rules: {
		// eslint
		"prefer-const": "error",
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

		// eslint-plugin-unicorn
		"unicorn/no-null": "off",
		"unicorn/prefer-module": "off",
		"unicorn/prefer-array-flat-map": "off",
		"unicorn/prefer-top-level-await": "off",

		// @typescript-eslint
		"@typescript-eslint/no-var-requires": "off",
	},
});
