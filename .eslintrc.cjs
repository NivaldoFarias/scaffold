/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		"prettier",
		"eslint:recommended",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:@typescript-eslint/strict-type-checked",
	],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	env: {
		es2023: true,
		node: true,
	},
	rules: {
		// eslint
		"no-unused-vars": "off",
		"prefer-const": "error",
		"no-console": ["error", { allow: ["warn", "error"] }],

		// @typescript-eslint
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports", fixStyle: "inline-type-imports" },
		],
		"@typescript-eslint/no-confusing-void-expression": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
	},
};
