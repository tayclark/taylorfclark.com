import { expect, test, type Page } from '@playwright/test';

const routes = ['/', '/projects', '/experience'] as const;
const widths = [320, 375, 768, 1440] as const;

async function expectNoHorizontalOverflow(page: Page) {
	const { scroll, client } = await page.evaluate(() => ({
		scroll: document.documentElement.scrollWidth,
		client: document.documentElement.clientWidth,
	}));
	expect(scroll).toBeLessThanOrEqual(client);
}

test.describe('responsive', () => {
	for (const width of widths) {
		for (const path of routes) {
			test(`${path} fits at ${width}px`, async ({ page }) => {
				await page.setViewportSize({ width, height: 800 });
				await page.goto(path);
				await expectNoHorizontalOverflow(page);
				await expect(page.getByRole('navigation', { name: 'Primary' })).toBeInViewport();
			});
		}

		test(`/ fits at ${width}px with the resume printed`, async ({ page }) => {
			await page.setViewportSize({ width, height: 800 });
			await page.goto('/');
			await page.locator('#term-input').fill('cat resume');
			await page.locator('#term-input').press('Enter');
			await expect(page.locator('#term-output .resume')).toBeVisible();
			await expectNoHorizontalOverflow(page);
		});
	}
});

test.describe('header', () => {
	for (const [path, current] of [
		['/', 'taylorfclark.com'],
		['/projects', 'Projects'],
		['/experience', 'Experience'],
	] as const) {
		test(`${path} marks ${current} as the current page`, async ({ page }) => {
			await page.goto(path);
			const nav = page.getByRole('navigation', { name: 'Primary' });
			await expect(nav.locator('[aria-current="page"]')).toHaveText(current);
			await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
		});
	}

	test('links between pages', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('navigation', { name: 'Primary' }).getByText('Projects').click();
		await expect(page).toHaveURL(/\/projects\/?$/);
		await page.getByRole('link', { name: 'taylorfclark.com' }).click();
		await expect(page).toHaveURL(/\/$/);
	});
});

test.describe('print', () => {
	test('/experience prints as plain black-on-white without site chrome', async ({ page }) => {
		// Dark scheme proves the print palette overrides it.
		await page.emulateMedia({ media: 'print', colorScheme: 'dark' });
		await page.goto('/experience');
		await expect(page.locator('.site-header')).toBeHidden();
		await expect(page.locator('.skip-link')).toBeHidden();
		await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
		await expect(page.locator('body')).toHaveCSS('color', 'rgb(0, 0, 0)');
		await expect(page.locator('.card').first()).toHaveCSS('break-inside', 'avoid');
	});
});
