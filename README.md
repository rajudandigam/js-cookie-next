# OSS NPM Library Template

**Template repo** for building modern TypeScript npm libraries with:

- **TypeScript strict**, zero runtime dependencies
- **ESM + CJS** with `exports` map; dist-only publish
- **Tiered engine** (SSR guard → fast path → fallback → structured failure)
- **React layer**: hook, component wrapper, React 19 action helper
- **Tests**: Vitest (unit, jsdom, coverage thresholds) + Playwright (E2E, demo as harness)
- **CI**: typecheck, unit, size-limit, Playwright
- **Release**: changesets + npm Trusted Publishing (OIDC-ready)
- **Demo app**: Vite app under `/demo` that imports from `dist` via aliases

## Quick start

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/oss-npm-lib-template.git
   cd oss-npm-lib-template
   npm install
   ```

2. **Rename for your library**  
   Follow **[docs/TEMPLATE-GUIDE.md](docs/TEMPLATE-GUIDE.md)** to change package name, repo URLs, exports, and source names.

3. **Run checks**
   ```bash
   npm run build
   npm run test
   npm run size
   npm run dev:demo   # then open http://localhost:5173
   npm run test:pw    # E2E (build first)
   ```
   Or run everything: `npm run test:all`

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `clean`       | Remove dist, coverage, playwright-report |
| `build`       | Build with tsup (ESM + CJS + types)  |
| `typecheck`   | `tsc --noEmit`                       |
| `test`        | Vitest unit tests                    |
| `test:watch`  | Vitest watch mode                    |
| `test:pw`     | Playwright E2E (demo app)            |
| `size`        | size-limit gate (run after build)    |
| `test:all`    | typecheck + test + build + size + test:pw |
| `dev:demo`    | Vite dev server for demo (port 5173) |
| `release`     | `changeset publish` (used by CI)     |

## Structure

- **`src/`** — Library code: `core/` (types, engine), `react/` (hook, component, actions), entry re-exports.
- **`demo/`** — Vite app; imports from `dist/*.mjs` via aliases (`@lib`, `@lib/core`, `@lib/react`).
- **`playwright/`** — E2E config and smoke tests against the demo.
- **`docs/`** — [DEV-ARCHITECTURE.md](docs/DEV-ARCHITECTURE.md), [TEMPLATE-GUIDE.md](docs/TEMPLATE-GUIDE.md), [PROMPT-LIBRARY.md](docs/PROMPT-LIBRARY.md), playbooks (CI, release, demo).

## Docs

- **[TEMPLATE-GUIDE.md](docs/TEMPLATE-GUIDE.md)** — Step-by-step renames to turn this into your library.
- **[DEV-ARCHITECTURE.md](docs/DEV-ARCHITECTURE.md)** — Goals, API contract, engine tiers, layout, testing, packaging, release.
- **[PROMPT-LIBRARY.md](docs/PROMPT-LIBRARY.md)** — Cursor prompt templates for engine, hook, component, actions, tests, CI, release.
- **[RELEASE-PLAYBOOK.md](docs/RELEASE-PLAYBOOK.md)** — npm Trusted Publishing (OIDC) and release flow.
- **[CI-PLAYBOOK.md](docs/CI-PLAYBOOK.md)** — CI jobs and local parity.
- **[DEMO-PLAYBOOK.md](docs/DEMO-PLAYBOOK.md)** — Demo app setup, aliases, Playwright, optional deploy.

## License

MIT — see [LICENSE](LICENSE).
