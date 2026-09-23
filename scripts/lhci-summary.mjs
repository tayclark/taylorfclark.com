// Renders the representative Lighthouse run per URL as a markdown table for
// the GitHub Actions step summary. Usage: node scripts/lhci-summary.mjs >> $GITHUB_STEP_SUMMARY
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('.lighthouseci/manifest.json', 'utf8'));
const pct = (n) => Math.round(n * 100);

console.log('## Lighthouse\n');
console.log('| Route | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');

for (const run of manifest.filter((r) => r.isRepresentativeRun)) {
	const { categories, audits } = JSON.parse(readFileSync(run.jsonPath, 'utf8'));
	const route = new URL(run.url).pathname;
	const cells = [
		pct(categories.performance.score),
		pct(categories.accessibility.score),
		pct(categories['best-practices'].score),
		pct(categories.seo.score),
		audits['largest-contentful-paint'].displayValue,
		audits['cumulative-layout-shift'].displayValue,
		audits['total-blocking-time'].displayValue,
	];
	console.log(`| \`${route}\` | ${cells.join(' | ')} |`);
}
