import { expect, test } from '@playwright/test';

const routes = ['/', '/projects', '/experience'];

test.describe('security headers (meta)', () => {
	for (const path of routes) {
		test(`${path} has a CSP and referrer policy`, async ({ page }) => {
			await page.goto(path);
			const csp = await page
				.locator('meta[http-equiv="content-security-policy"]')
				.getAttribute('content');
			expect(csp).toContain("default-src 'self'");
			expect(csp).toContain("form-action 'none'");
			expect(csp).toContain("base-uri 'self'");
			expect(csp).not.toContain('unsafe-inline');
			await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
				'content',
				'strict-origin-when-cross-origin',
			);
		});
	}

	test('terminal still works with no CSP violations', async ({ page }) => {
		const violations: string[] = [];
		page.on('console', (msg) => {
			if (/content security policy/i.test(msg.text())) violations.push(msg.text());
		});
		await page.goto('/');
		const input = page.getByRole('textbox');
		await input.fill('cat resume');
		await input.press('Enter');
		await expect(page.locator('#term-output')).toContainText(/experience/i);
		expect(violations).toEqual([]);
	});
});
