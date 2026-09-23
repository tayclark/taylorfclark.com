/** @type {import('prettier').Config} */
export default {
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	plugins: ['prettier-plugin-astro'],
	overrides: [
		{
			files: '*.astro',
			options: { parser: 'astro' },
		},
		{
			// JSON is conventionally 2-space across the ecosystem (npm, VS Code,
			// tsconfig) — other tools that rewrite these files (npm pkg set, the
			// VS Code JSON schema writer) use spaces regardless, so matching
			// tabs here would just fight them on every future edit.
			files: '*.json',
			options: { useTabs: false, tabWidth: 2 },
		},
	],
};
