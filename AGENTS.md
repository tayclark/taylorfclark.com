# taylorfclark.com

Personal portfolio: a static Astro 7 site (TypeScript, no UI framework) with a
terminal-style prompt on the home page, deployed to GitHub Pages at
`taylorfclark.com` (`public/CNAME`).

## Stack and commands

- Node `>=22.22.1` (`.nvmrc` is 22; run `nvm use`). Package manager is npm.
- Dev server: `npx astro dev --background`; manage it with `npx astro dev stop`,
  `status` and `logs`. Astro also backgrounds `dev`/`preview` on its own when it
  detects an agent, so Playwright passes `--ignore-lock`.
- `npm run check` (astro check), `lint` (strict typescript-eslint), `format:check`
  (Prettier), `test:unit` / `test:coverage` (Vitest), `test:e2e` (Playwright, axe
  a11y, layout and CSP checks against the built site on port 4322) and
  `lighthouse:ci` (needs a fresh `npm run build` first).
- Run check, lint, format:check and test:coverage before calling a change done.
  A husky pre-commit hook runs eslint and prettier on staged files, and
  commitlint enforces Conventional Commits with body lines of at most 100 chars.

## Architecture

- `src/data/` is the single source of truth for content: `site.ts` (links,
  terminal targets, `SITE_TITLE`/`SITE_DESCRIPTION`), `projects.ts` (typed
  `Project[]`) and `resume.ts`. Pages import from here rather than inlining data.
- `src/lib/` holds the terminal logic as standalone modules: `terminal.ts`,
  `dom.ts` (`el()` DOM helper) and `resume-dom.ts` (`buildResume`). The
  `TerminalPrompt.astro` script only wires them to the page.
- `src/styles/tokens.css` holds the design tokens (color, type, spacing, terminal
  theme) and documents them in its header comment. Use the tokens instead of raw
  values; `SiteHeader.astro` renders the shared nav from `pageLinks` in `site.ts`.
- Files under `src/lib/**` must stay at least 90% covered (`vitest.config.ts`).
  Tests that touch the DOM need `// @vitest-environment jsdom` at the top.

- `src/data/resume.ts` feeds only the terminal's `cat resume`. The `/experience`
  page keeps its own inline entries in `experience.astro`, so a resume edit must
  be made in both places until they are unified.

## Performance budgets

`lighthouserc.cjs` asserts Lighthouse performance 100 on every route, LCP <= 2.5 s, script <= 10 KB
and total <= 150 KB (raw bytes), with zero third-party and zero font requests. `tests/e2e/performance.spec.ts`
also fails on cross-origin requests, `<img>` without `width`/`height`, and `@font-face` without
`font-display: swap`. Load images through `astro:assets` (explicit size, webp/avif, preload the LCP
image) and keep the system font stack, or self-host a subsetted font and raise the font budget on purpose.

## Security and CSP

GitHub Pages can't set headers, so Astro emits the CSP as a `<meta>` tag with
build-time hashes (`security.csp` in `astro.config.mjs`). It only applies in
`build` and `preview`, not `astro dev`, and uses one shared hash set across all
pages. `tests/e2e/security.spec.ts` fails on console CSP violations.

## CI, branches and launch status

- `.github/workflows/deploy.yml` has one `build` job (npm audit for prod deps,
  check, lint, format, coverage, build, Lighthouse CI, e2e) and a `deploy` job
  that runs only on `main`. `build` is the required status check on `main`;
  branch protection applies to admins too and forbids force-push and deletion.
- Work on a feature branch, open a PR, and merge with `gh pr merge --merge`
  (history uses merge commits). Dependabot runs weekly and ignores TypeScript
  major bumps until typescript-eslint and `@astrojs/check` support v7.
- The site is `noindex, nofollow` (`Layout.astro`) until SEO launch prep (#3), so
  the Lighthouse SEO assertion is warn-only. #3 flips it to `error`.
- `CLAUDE.md` is a symlink to `AGENTS.md`; edit and stage `AGENTS.md`.
- Grades per facet live in `docs/service-assessment.md`.
