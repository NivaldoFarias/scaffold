/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	{
		plugins: ["@typescript-eslint"],
		extends: [
			"prettier",
			"eslint:recommended",
			"plugin:unicorn/recommended",
			"plugin:@typescript-eslint/recommended",
		],
		languageOptions: {
			parser: "@typescript-eslint/parser",
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {
			// eslint
			"prefer-const": "error",
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

			// eslint-plugin-unicorn
			"unicorn/no-null": "off",
			"unicorn/prefer-array-flat-map": "off",
		},
	},
];
