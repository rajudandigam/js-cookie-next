# Development architecture

This document is the **single source of truth** for how this repo is structured and how to extend it.

## Goals

- **TypeScript-first**, strict mode, zero runtime dependencies.
- **ESM + CJS** outputs with an `exports` map; dist-only publish.
- **Tiered engine**: SSR guard → modern path → fallback → structured failure (metadata moat).
- **React layer**: hook, component wrapper, and React 19 action helper.
- **Testing pyramid**: unit tests (Vitest + jsdom) with coverage thresholds; E2E smoke (Playwright) using demo app.
- **Gates**: typecheck, unit, size-limit, Playwright in CI; separate release workflow.
- **Release**: changesets + npm Trusted Publishing (OIDC-ready).

## API contract (metadata moat)

Core function returns a structured result, e.g.:

- `success: boolean`
- `method: "fast" | "fallback" | "unsupported" | "failed"`
- `code?: "NO_SUPPORT" | "UNKNOWN"`
- `error?: unknown`

No UI assumptions; the library does not render toasts or dialogs.

## Repo layout

- **`src/`** — All library code. `core/` (types, engine), `react/` (hook, component, actions), entry re-exports (`index.ts`, `core.ts`, `react.ts`).
- **`demo/`** — Vite app that imports from `dist/*.mjs` via aliases; used as Playwright harness.
- **`playwright/`** — E2E config and tests.
- **`docs/`** — DEV-ARCHITECTURE, TEMPLATE-GUIDE, PROMPT-LIBRARY, playbooks (CI, release, demo).
- **`.github/workflows/`** — CI (typecheck, unit, size, playwright), Release (changesets + publish).

## Engine tiers

1. **Tier 0** — SSR guard: if `window`/`document` missing, return `unsupported` + `NO_SUPPORT`.
2. **Tier 1** — Fast path (e.g. short input).
3. **Tier 2** — Fallback path (e.g. empty or edge case).
4. **Tier 3** — Structured failure (`failed` + optional code).

Never access `window`/`document`/`navigator` at module top-level.

## Testing plan

- **Unit**: Vitest, jsdom. Coverage is collected (v8, text/html/lcov); entry points and demo/playwright excluded. No enforced thresholds by default.
- **E2E**: Playwright, Chromium/Firefox/WebKit, demo app as harness; assert UI state only (no clipboard/OS-specific APIs in assertions).

## Packaging

- **tsup**: `src/index.ts`, `src/core.ts`, `src/react.ts` → `dist/*.mjs`, `dist/*.cjs`, `dist/*.d.ts`.
- **Exports**: `.`, `./core`, `./react` with `types`, `import`, `require`.
- **Publish**: `files: ["dist"]`, `sideEffects: false`.

## Release flow

1. Create changeset(s) with `npx changeset`.
2. Merge to `main`; CI runs.
3. Release workflow runs on push to `main`; changesets/action versions and publishes via `npm run release`.
4. npm Trusted Publishing (OIDC) must be configured in npm package settings — see RELEASE-PLAYBOOK.md.

## Implementation order (for new libraries)

1. Types and core engine (with unit tests).
2. React hook, component, actions (with unit tests).
3. Entry exports and packaging.
4. Demo app and Playwright smoke.
5. Docs and Cursor rules.
