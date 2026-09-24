import { expect, test } from '@playwright/test';

// Guards for the conventions in AGENTS.md that Lighthouse doesn't catch cheaply.
const routes = ['/', '/projects', '/experience'];

test.describe('performance conventions', () => {
	for (const path of routes) {
		test(`${path} makes no cross-origin requests`, async ({ page, baseURL }) => {
			const external: string[] = [];
			page.on('request', (request) => {
				const { protocol, origin } = new URL(request.url());
				if (protocol.startsWith('http') && origin !== new URL(baseURL ?? '').origin) {
					external.push(request.url());
				}
			});
			await page.goto(path);
			await page.waitForLoadState('networkidle');
			expect(external).toEqual([]);
		});

		test(`${path} images declare width and height`, async ({ page }) => {
			await page.goto(path);
			const missing = await page
				.locator('img')
				.evaluateAll((imgs) =>
					imgs
						.filter((img) => !img.getAttribute('width') || !img.getAttribute('height'))
						.map((img) => img.getAttribute('src')),
				);
			expect(missing).toEqual([]);
		});

		test(`${path} web fonts use font-display: swap`, async ({ page }) => {
			await page.goto(path);
			const missing = await page.evaluate(() =>
				[...document.styleSheets]
					.flatMap((sheet) => [...sheet.cssRules])
					.filter((rule): rule is CSSFontFaceRule => rule instanceof CSSFontFaceRule)
					.filter((rule) => rule.style.getPropertyValue('font-display') !== 'swap')
					.map((rule) => rule.style.getPropertyValue('font-family')),
			);
			expect(missing).toEqual([]);
		});
	}
});
