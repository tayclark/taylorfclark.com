# taylorfclark.com

Personal portfolio site: Astro, static build, deployed to GitHub Pages via
`.github/workflows/deploy.yml` on push to `main`. Contributor and architecture
notes are in [`AGENTS.md`](AGENTS.md); per-facet grades are in
[`docs/service-assessment.md`](docs/service-assessment.md).

## Quick start

```sh
nvm use        # Node 22 (engines: >=22.22.1)
npm ci
npm run dev    # http://localhost:4321
```

## Scripts

| Command                 | Action                                                         |
| :---------------------- | :------------------------------------------------------------- |
| `npm run dev`           | Start the dev server at `localhost:4321`                       |
| `npm run build`         | Build the production site to `./dist/`                         |
| `npm run preview`       | Serve the build locally (CSP only applies here, not in dev)    |
| `npm run check`         | Typecheck `.astro` and TypeScript files                        |
| `npm run lint`          | Lint with ESLint                                               |
| `npm run format`        | Format with Prettier (`format:check` to verify)                |
| `npm run test:unit`     | Vitest unit tests                                              |
| `npm run test:coverage` | Unit tests with the 90% coverage gate on `src/lib/**`          |
| `npm run test:e2e`      | Playwright e2e, accessibility and CSP tests (builds the site)  |
| `npm test`              | Unit tests, then e2e                                           |
| `npm run lighthouse:ci` | Lighthouse budgets against `dist/` (run `npm run build` first) |

## Layout

- `src/data/`: content (`site.ts`, `projects.ts`, `resume.ts`)
- `src/lib/`: terminal logic and DOM helpers, unit tested
- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/tokens.css`
- `tests/e2e/`: Playwright specs

## Deploy

Every push to `main` runs the `build` job (audit, check, lint, format, tests,
Lighthouse, e2e) and, if it passes, publishes `dist/` to GitHub Pages. Pull
requests run the same `build` job but never deploy. `public/CNAME` maps the site
to `taylorfclark.com`. `main` is protected: `build` must pass and force-pushes
are blocked.

## Updating the resume

The terminal's `cat resume` reads `src/data/resume.ts`. The `/experience` page
has its own inline entries in `src/pages/experience.astro`, so update both, then
run `npm test`.
