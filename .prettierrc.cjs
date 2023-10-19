/** @type {import("prettier").Config} */
module.exports = {
	semi: true,
	tabWidth: 2,
	useTabs: true,
	printWidth: 100,
	endOfLine: "lf",
	singleQuote: false,
	proseWrap: "always",
	insertPragma: false,
	requirePragma: false,
	trailingComma: "all",
	bracketSpacing: true,
	arrowParens: "always",
	jsxSingleQuote: false,
	bracketSameLine: false,
	quoteProps: "consistent",
	singleAttributePerLine: true,
	htmlWhitespaceSensitivity: "ignore",
	overrides: [
		{
			files: ["*.d.ts", "*.json"],
			options: {
				tabWidth: 4,
				useTabs: false,
			},
		},
	],
};
