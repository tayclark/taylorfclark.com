# Service assessment

Live grade per facet, with an honest note on what the grade rests on. Update the
grade and date when the evidence changes. Last assessed 2026-09-24.

| Facet         | Grade | Notes                                                                                                                                                   |
| :------------ | :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Functionality | B+    | Home terminal (tab completion, chips), projects and experience pages work. Only 3 projects; content depth is #9.                                        |
| Security      | A-    | Meta CSP with hashes, `form-action 'none'`, prod `npm audit` gate, e2e CSP check. CSP not yet eyeballed in devtools; no HTTP headers possible on Pages. |
| Testing       | A-    | 48 unit tests, 100% lines and 94.5% branches on the measured `src/lib` file; e2e covers layout, a11y (axe) and CSP. No manual VoiceOver pass yet.       |
| Accessibility | A-    | Lighthouse 100 on all routes and axe e2e. Manual keyboard and screen reader pass still open.                                                            |
| Performance   | A+    | Lighthouse 100, LCP 0.6-0.7 s, CLS 0-0.002, TBT 0 ms (2026-09-24). Budgets enforced in CI; #11 tracks holding it.                                       |
| SEO           | C     | Lighthouse SEO 63 because the site is `noindex, nofollow` until launch. Warn-only in CI. Plan is #3.                                                    |
| Documentation | B+    | `AGENTS.md`, README and this file cover setup, CI and architecture. Resume data is duplicated in `resume.ts` and `experience.astro`.                    |
| Deployment/CI | A     | One required `build` check, enforced for admins, Pages deploy on `main`, Dependabot weekly. Node floor pinned.                                          |
| DX            | A-    | Husky, lint-staged, commitlint, strict ESLint, design tokens. Coverage output only lists one file, worth checking the `include` glob.                   |
