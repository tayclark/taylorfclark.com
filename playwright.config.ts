import { defineConfig, devices } from '@playwright/test';

const port = 4322;

export default defineConfig({
	testDir: 'tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: `http://localhost:${port}`,
		trace: 'on-first-retry',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	// Test the built site, since that's what ships. --ignore-lock keeps Astro from
	// auto-backgrounding the preview server (it does when it detects an AI agent),
	// which Playwright would otherwise read as the server exiting early.
	webServer: {
		command: `npm run build && npm run preview -- --port ${port} --ignore-lock`,
		url: `http://localhost:${port}`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
