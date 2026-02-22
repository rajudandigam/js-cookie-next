# Development architecture (js-cookie-next)

This document is the **single source of truth** for repo structure, build order, and testing plan. For **behavior and API contract**, see the locked specs: **docs/API.md** and **docs/ARCH.md**.

---

## 1. Goal and scope (v1)

- **js-cookie-next** is a vanilla browser cookie utility: sync API (js-cookie–compatible) + async API (Cookie Store API with document.cookie fallback).
- TypeScript-first, strict mode, zero runtime dependencies.
- CHIPS-aware options and partitioned preset; SSR-safe (no top-level document/window access).
- Target: &lt; 2KB gzipped; dist-only publish; ESM + CJS.
- Scope: no React, no demo app, no compliance/consent logic. See **docs/PRD.md** for full product scope.

---

## 2. Public API contract (brief)

- **Sync:** `get`, `set`, `remove` (document.cookie).
- **Async:** `getAsync`, `setAsync`, `removeAsync` (cookieStore when available, else sync wrapped in Promise).
- **Types:** `CookieOptions`; default export object for compatibility.
- **Behavior:** SSR-safe; no throws for browser rejection or missing cookieStore; dev-only warning for sameSite=none without secure.

**Full spec:** **docs/API.md** (locked).

---

## 3. Architecture overview

- **Strategy:** Async methods use cookieStore when present; otherwise fall back to sync. Sync methods always use document.cookie. No polyfills.
- **Layers:** Core sync (parse, serialize, get/set/remove) → async adapter (detect, adapter, asyncApi) → public index.

**Full architecture:** **docs/ARCH.md** (locked).

---

## 4. Repo layout (expected paths under src/)

```
src/
├── core/
│   ├── parse.ts
│   ├── serialize.ts
│   ├── normalizeOptions.ts
│   ├── get.ts
│   ├── set.ts
│   └── remove.ts
├── async/
│   ├── detectCookieStore.ts
│   ├── cookieStoreAdapter.ts
│   └── asyncApi.ts
├── types.ts
├── devWarnings.ts
└── index.ts
```

- **core/** — Sync implementation only; no async or cookieStore here.
- **async/** — Native detection, adapter, and async API; calls into core for fallback.
- **types.ts** — CookieOptions and any shared types.
- **devWarnings.ts** — Dev-only warnings (e.g. sameSite=none without secure).
- **index.ts** — Public exports + default export object.

---

## 5. Implementation order

Work **one module at a time**; add tests with each module. Do not add features beyond **docs/PRD.md**.

1. **types.ts** — CookieOptions and shared types (per API.md). Unit tests for type usage if needed.
2. **core/parse.ts** — Parse document.cookie string → object. Unit tests: splitting, decoding, edge cases (empty, duplicates).
3. **core/serialize.ts** — Cookie name=value + attributes to Set-Cookie–style string. Unit tests: path, domain, expires, maxAge, secure, sameSite, partitioned, priority.
4. **core/normalizeOptions.ts** — Apply CHIPS preset (mode: `"partitioned"` → defaults). Unit tests: preset merge, explicit overrides.
5. **core/get.ts**, **core/set.ts**, **core/remove.ts** — Sync API with SSR guard (no document at top-level). Unit tests: get/set/remove, path/domain match for remove, SSR (no document).
6. **async/detectCookieStore.ts** — Lazy detection only (no top-level access). Unit test: returns boolean, no throw.
7. **async/cookieStoreAdapter.ts** — Map CookieOptions to cookieStore shape; get/set/delete via cookieStore. Unit tests with mocked cookieStore.
8. **async/asyncApi.ts** — getAsync, setAsync, removeAsync (use adapter when available, else Promise.resolve(sync)). Unit tests: fallback path, native path when mocked.
9. **devWarnings.ts** — Dev-only sameSite=none warning. Unit test: warn when appropriate, no-op in production.
10. **index.ts** — Re-export get, set, remove, getAsync, setAsync, removeAsync, CookieOptions; default export object. No new behavior; smoke test via existing unit coverage.
11. **Unit tests** — Ensure coverage for all modules above; aim for ≥95% on core + async (see Testing plan).
12. **Size-limit tuning** — Run build + size; adjust package.json limit if needed (&lt; 2KB gzip target).
13. **CI finalization** — Ensure typecheck, unit, size pass; Playwright remains no-op until harness exists.

---

## 6. Testing plan

- **Tool:** Vitest, jsdom.
- **Scope:** All of `src/` except entry re-exports (e.g. index.ts can be excluded from coverage if only re-exporting).
- **Coverage:** Collect v8 (text, html, lcov). Target **≥95%** for `src/core/` and `src/async/` (thresholds can be enabled in vitest.config when ready).
- **Rules:** No clipboard or OS-specific APIs. Mock `document.cookie` and `cookieStore` where needed. SSR tests: no document.

---

## 7. E2E stance (vanilla lib)

- **No demo app.** For E2E we may add a **minimal harness** later (not a full app).
- **Planned harness:** Either a static HTML fixture under **playwright/** (e.g. `playwright/fixtures/` or a single HTML file served for tests) or a small **e2e/** folder with static HTML + Playwright config pointing at it. No Vite/React app.
- **Current state:** Playwright job in CI is a no-op until this harness exists. When added: run real Playwright tests and optionally re-add `test:pw` to `test:all`.

---

## 8. Packaging plan

- **tsup:** Single entry `src/index.ts` → `dist/index.mjs`, `dist/index.cjs`, `dist/index.d.ts`. ESM + CJS, dts, sourcemaps, clean.
- **Exports:** `"."` with `types`, `import`, `require` (see package.json). No `./core` or `./react`.
- **Publish:** `files: ["dist"]`, `sideEffects: false`. No runtime dependencies.

---

## 9. CI plan

Mirrors **docs/CI-PLAYBOOK.md**; no demo.

- **typecheck** — `npm ci` → `npm run typecheck`.
- **unit** — Depends on typecheck; `npm run test`; upload coverage artifact.
- **size** — Depends on typecheck; `npm run build` → `npm run size`.
- **playwright** — No-op until minimal E2E harness exists (see §7).
- **Local parity:** `npm run test:all` = typecheck → test → build → size (no test:pw for now).

---

## 10. Release plan

- **Changesets:** Add changeset with `npx changeset`; merge to main.
- **Release workflow:** On push to main, runs `npm run test:all` then changesets/action with `npm run release` (changeset publish). npm **Trusted Publishing (OIDC)** required — see **docs/RELEASE-PLAYBOOK.md**.

---

## 11. Cursor workflow

- **One module at a time** — Implement in the order in §5; do not skip ahead.
- **No speculative features** — Stay within **docs/PRD.md** and **docs/API.md**; no watch(), no Next adapter, no consent logic unless specified there.
- **Tests with each module** — Every new or changed module must have or update unit tests in the same change.
- **Specs are law** — **docs/API.md** and **docs/ARCH.md** are locked; **docs/DEV-ARCHITECTURE.md** is the execution guide (structure, order, testing, CI, release).
