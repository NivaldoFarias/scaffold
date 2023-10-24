export const ENVIRONMENTS = [
	{ value: "browser", label: "Browser only" },
	{ value: "node", label: "Node.js only" },
	{ value: "both", label: "Both" },
];

export const FRAMEWORKS = {
	browser: [
		{ value: "react", label: "React" },
		{ value: "vue", label: "Vue" },
		{ value: "svelte", label: "Svelte" },
		{ value: "angular", label: "Angular" },
		{ value: "vanilla", label: "Vanilla JS", hint: "oh no" },
	],
	node: [
		{ value: "nestjs", label: "NestJS" },
		{ value: "express", label: "Express.js" },
		{ value: "koa", label: "Koa" },
		{ value: "fastify", label: "Fastify" },
		{ value: "vanilla", label: "Vanilla JS", hint: "oh no" },
	],
	both: [
		{ value: "nextjs", label: "Next.js" },
		{ value: "nuxtjs", label: "Nuxt.js" },
		{ value: "sveltekit", label: "SvelteKit" },
	],
};

export const LANGUAGES = [
	{ value: "typescript", label: "TypeScript" },
	{ value: "javascript", label: "JavaScript" },
	{ value: "both", label: "A mix of both" },
];

export const ORM = {
	typescript: [
		{ value: "typeorm", label: "TypeORM" },
		{ value: "prisma", label: "Prisma" },
		{ value: "sequelize", label: "Sequelize" },
		{ value: "drizzle", label: "Drizzle" },
		{ value: "mongoose", label: "Mongoose" },
	],
	javascript: [
		{ value: "prisma", label: "Prisma" },
		{ value: "mongoose", label: "Mongoose" },
		{ value: "sequelize", label: "Sequelize" },
	],
};

export const TOOLING = [
	{ value: "eslint", label: "ESLint" },
	{ value: "prettier", label: "Prettier" },
];

export const TOOLING_PLUGINS = {
	eslint: {
		typescript: [
			{ value: "@typescript-eslint/parser", label: "@typescript-eslint/parser" },
			{ value: "@typescript-eslint/eslint-plugin", label: "@typescript-eslint/eslint-plugin" },
		],
		vue: [
			{ value: "eslint-plugin-vue", label: "eslint-plugin-vue" },
			{
				value: "eslint-plugin-prettier-vue",
				label: "eslint-plugin-prettier-vue",
				hint: "formatting",
			},
		],
		react: [{ value: "eslint-plugin-react", label: "eslint-plugin-react" }],
		svelte: [
			{ value: "svelte-eslint-parser", label: "svelte-eslint-parser" },
			{ value: "eslint-plugin-svelte", label: "eslint-plugin-svelte" },
		],
		nextjs: [{ value: "eslint-plugin-next", label: "eslint-plugin-next" }],
		angular: [{ value: "@angular-eslint/eslint-plugin", label: "@angular-eslint/eslint-plugin" }],
		nestjs: [
			{
				value: "@darraghor/eslint-plugin-nestjs-typed",
				label: "@darraghor/eslint-plugin-nestjs-typed",
				hint: "(unofficial)",
			},
		],
	},
	prettier: {
		javascript: [
			{
				value: "prettier-plugin-jsdoc",
				label: "prettier-plugin-jsdoc",
			},
		],
		prisma: [
			{
				value: "prettier-plugin-prisma",
				label: "prettier-plugin-prisma",
			},
		],
	},
};
