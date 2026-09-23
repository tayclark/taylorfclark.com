import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const routes = ['/', '/projects', '/experience'] as const;
const schemes = ['light', 'dark'] as const;

async function expectNoViolations(page: Page) {
	const { violations } = await new AxeBuilder({ page }).analyze();
	expect(violations).toEqual([]);
}

test.describe('axe', () => {
	for (const scheme of schemes) {
		for (const path of routes) {
			test(`${path} has no violations (${scheme})`, async ({ page }) => {
				await page.emulateMedia({ colorScheme: scheme });
				await page.goto(path);
				await expectNoViolations(page);
			});
		}

		test(`/ has no violations after cat resume (${scheme})`, async ({ page }) => {
			await page.emulateMedia({ colorScheme: scheme });
			await page.goto('/');
			await page.locator('#term-input').fill('cat resume');
			await page.locator('#term-input').press('Enter');
			await expect(page.locator('#term-output .resume')).toBeVisible();
			await expectNoViolations(page);
		});
	}
});

test.describe('keyboard', () => {
	test('skip link is the first tab stop and targets main', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		const skipLink = page.getByRole('link', { name: 'Skip to content' });
		await expect(skipLink).toBeFocused();
		await expect(skipLink).toBeInViewport();
		await expect(skipLink).toHaveAttribute('href', '#main');
		await expect(page.locator('main#main')).toHaveCount(1);
	});

	test('terminal input shows a visible focus indicator', async ({ page }) => {
		await page.goto('/');
		const input = page.locator('#term-input');
		await input.focus();
		const outline = await input.evaluate((el) => {
			const { outlineStyle, outlineWidth } = getComputedStyle(el);
			return { outlineStyle, outlineWidth };
		});
		expect(outline.outlineStyle).not.toBe('none');
		expect(parseFloat(outline.outlineWidth)).toBeGreaterThanOrEqual(2);
	});

	test('terminal output is keyboard focusable', async ({ page }) => {
		await page.goto('/');
		const output = page.getByRole('region', { name: 'Terminal output' });
		await output.focus();
		await expect(output).toBeFocused();
	});

	test('resume is announced via the status region, not dumped into it', async ({ page }) => {
		await page.goto('/');
		await page.locator('#term-input').fill('cat resume');
		await page.locator('#term-input').press('Enter');
		const status = page.getByRole('status');
		await expect(status).toContainText('Resume printed');
		expect((await status.textContent())?.length ?? 0).toBeLessThan(300);
	});
});
