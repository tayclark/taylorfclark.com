// The site is served from the domain root, so LHCI's static server can serve
// dist/ as-is (no base-path workaround needed).
const pass = (level, min) => [level, { minScore: min }];

module.exports = {
	ci: {
		collect: {
			staticDistDir: './dist',
			url: ['/', '/projects/', '/experience/'].map((p) => `http://localhost${p}`),
			numberOfRuns: 3,
			settings: {
				// Lantern simulation has produced false LCP regressions elsewhere.
				throttlingMethod: 'devtools',
			},
		},
		assert: {
			assertions: {
				'categories:performance': pass('error', 0.9),
				'categories:accessibility': pass('error', 0.9),
				'categories:best-practices': pass('error', 0.9),
				// Warn only: the site is noindexed until launch, which fails
				// is-crawlable. Make this an error when #3 (SEO) lands.
				'categories:seo': pass('warn', 0.9),
				'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 600 }],
			},
		},
		upload: { target: 'filesystem', outputDir: '.lighthouseci' },
	},
};
