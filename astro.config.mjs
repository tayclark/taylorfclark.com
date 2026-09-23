// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://taylorfclark.com',
	compressHTML: true,
	integrations: [sitemap()],
	// GitHub Pages can't set headers, so Astro emits the CSP as a <meta> tag
	// with build-time hashes for the inline script and styles.
	security: {
		csp: {
			directives: [
				"default-src 'self'",
				"base-uri 'self'",
				"form-action 'none'",
				"object-src 'none'",
				"img-src 'self' data:",
			],
		},
	},
});
