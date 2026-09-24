import { expect, test, type Page } from '@playwright/test';

test.describe('routes', () => {
	for (const [path, heading] of [
		['/', 'Taylor Clark'],
		['/projects', 'Projects'],
		['/experience', 'Experience'],
	] as const) {
		test(`${path} loads`, async ({ page }) => {
			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
		});
	}
});

test.describe('terminal', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	const input = (page: Page) => page.locator('#term-input');
	const output = (page: Page) => page.locator('#term-output');

	test('accepts input and echoes the command', async ({ page }) => {
		await input(page).fill('help');
		await input(page).press('Enter');
		await expect(output(page)).toContainText('$ help');
		await expect(output(page)).toContainText('commands: ls, cd <page>');
		await expect(input(page)).toHaveValue('');
	});

	test('reports an unknown command', async ({ page }) => {
		await input(page).fill('bogus');
		await input(page).press('Enter');
		await expect(output(page)).toContainText('command not found: bogus');
	});

	test('cat resume renders the structured resume', async ({ page }) => {
		await input(page).fill('cat resume');
		await input(page).press('Enter');
		await expect(output(page).locator('.resume .r-name')).toBeVisible();
		await expect(output(page).locator('.resume .r-heading').first()).toBeVisible();
	});

	test('ArrowUp/ArrowDown walk command history', async ({ page }) => {
		for (const cmd of ['ls', 'help']) {
			await input(page).fill(cmd);
			await input(page).press('Enter');
		}
		await input(page).press('ArrowUp');
		await expect(input(page)).toHaveValue('help');
		await input(page).press('ArrowUp');
		await expect(input(page)).toHaveValue('ls');
		await input(page).press('ArrowDown');
		await expect(input(page)).toHaveValue('help');
		await input(page).press('ArrowDown');
		await expect(input(page)).toHaveValue('');
	});

	test('Tab completes a verb and an argument', async ({ page }) => {
		await input(page).fill('he');
		await input(page).press('Tab');
		await expect(input(page)).toHaveValue('help ');
		await input(page).fill('cd pr');
		await input(page).press('Tab');
		await expect(input(page)).toHaveValue('cd projects');
	});

	test('Tab lists candidates when the prefix is ambiguous', async ({ page }) => {
		await input(page).fill('c');
		await input(page).press('Tab');
		await expect(input(page)).toBeFocused();
		await expect(output(page)).toContainText('cd  cat');
	});

	test('Tab on empty input moves focus on instead of trapping it', async ({ page }) => {
		await input(page).focus();
		await page.keyboard.press('Tab');
		await expect(input(page)).not.toBeFocused();
	});

	test('cd projects navigates', async ({ page }) => {
		await input(page).fill('cd projects');
		await input(page).press('Enter');
		await expect(page).toHaveURL(/\/projects\/?$/);
	});

	test('open github opens a new window', async ({ page, context }) => {
		// Keep the suite offline: stub the external page rather than load it.
		await context.route('https://github.com/**', (route) => route.fulfill({ body: '' }));
		// `noopener` windows surface as context pages, not `popup` events.
		const newPage = context.waitForEvent('page');
		await input(page).fill('open github');
		await input(page).press('Enter');
		await (await newPage).waitForURL(/github\.com/);
	});
});
