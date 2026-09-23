// @ts-check
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	globalIgnores([
		'dist/',
		'.astro/',
		'node_modules/',
		'coverage/',
		'playwright-report/',
		'test-results/',
		'.lighthouseci/',
	]),
	js.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	eslintPluginAstro.configs['flat/recommended'],
	{
		// Plain Node config files (astro.config.mjs and friends) aren't
		// covered by typescript-eslint's TS-only file patterns, so they don't
		// pick up Node ambient types the way .ts files do via @types/node.
		files: ['**/*.mjs', '**/*.cjs'],
		languageOptions: {
			globals: globals.node,
		},
	},
	// Must stay last — disables stylistic rules that would otherwise fight
	// Prettier's own formatting decisions.
	eslintConfigPrettier,
);
