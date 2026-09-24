// The site is served from the domain root, so LHCI's static server can serve
// dist/ as-is (no base-path workaround needed).
const pass = (level, min) => [level, { minScore: min }];

module.exports = {
	ci: {
		collect: {
			staticDistDir: './dist',
			url: ['/', '/projects/', '/experience/'].map((p) => `http://localhost${p}`),
			numberOfRuns: 3,
			// Default (Lantern) throttling. Measured 2026-09-24: perf 100 and LCP within
			// 1 ms across reps in ~95 s, vs. 627-806 ms LCP spread in ~245 s with
			// 'devtools'. Revert to devtools if Lantern reports a false LCP regression.
		},
		assert: {
			assertions: {
				'categories:performance': pass('error', 1),
				'categories:accessibility': pass('error', 0.9),
				'categories:best-practices': pass('error', 0.9),
				// Warn only: the site is noindexed until launch, which fails
				// is-crawlable. Make this an error when #3 (SEO) lands.
				'categories:seo': pass('warn', 0.9),
				'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 600 }],
				// Size budgets in bytes. The static server doesn't compress, so
				// these are raw sizes, stricter than what production transfers.
				'resource-summary:script:size': ['error', { maxNumericValue: 10 * 1024 }],
				'resource-summary:total:size': ['error', { maxNumericValue: 150 * 1024 }],
				// No external requests and no web fonts (system font stack). Adding
				// either should be a deliberate change to these budgets.
				'resource-summary:third-party:count': ['error', { maxNumericValue: 0 }],
				'resource-summary:font:count': ['error', { maxNumericValue: 0 }],
			},
		},
		upload: { target: 'filesystem', outputDir: '.lighthouseci' },
	},
};
