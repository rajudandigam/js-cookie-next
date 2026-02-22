# Prompt library (Cursor prompts)

Use these prompts when implementing or changing parts of js-cookie-next. This is a **vanilla** browser utility (no React). Follow docs/ARCH.md and docs/API.md as the source of truth.

---

## Core (sync API)

**Prompt:** Implement sync cookie API per docs/API.md and docs/ARCH.md: `get`, `set`, `remove` using `document.cookie`. SSR-safe: no top-level `window`/`document`/`navigator`; guard all browser access inside functions. Include `parse`, `serialize`, and `normalizeOptions` (CHIPS preset) in `src/core/`. Add unit tests for parse, serialize, preset merging, and SSR (no document).

---

## Async API

**Prompt:** Implement async API per docs/API.md and docs/ARCH.md: `getAsync`, `setAsync`, `removeAsync`. Use `cookieStore` when available; otherwise fall back to sync implementation wrapped in `Promise.resolve`. Lazy detection only (no top-level access). Add unit tests for fallback when cookieStore is undefined and for native path when mocked.

---

## Types and options

**Prompt:** Define `CookieOptions` and default-export wrapper type per docs/API.md. Support `path`, `domain`, `expires`, `maxAge`, `secure`, `sameSite`, `partitioned`, `priority`, `mode`. Implement partitioned preset (mode `"partitioned"` → defaults for partitioned, secure, sameSite).

---

## Tests

**Prompt:** Add Vitest unit tests for [core/async]. Use jsdom. Cover: parse correctness, serialize formatting, preset merging, removal semantics, dev warnings, fallback when cookieStore missing. Do not rely on OS-specific or clipboard APIs.

---

## Packaging

**Prompt:** Ensure package.json exports map has "." with types, import, and require. tsup.config.ts single entry for `src/index.ts`. Build outputs dist/index.mjs, dist/index.cjs, dist/index.d.ts. No runtime dependencies. Size limit for dist/index.mjs (see package.json).

---

## CI

**Prompt:** CI workflow: jobs typecheck, unit (with coverage artifact), size (after build), playwright (no-op until harness exists). Use Node 20, npm ci. Concurrency group on ref. No secrets required for CI.

---

## Release

**Prompt:** Release workflow: on push to main, run test:all then changesets/action with publish command `npm run release`. Permissions: contents write, pull-requests write, id-token write (OIDC). Document in RELEASE-PLAYBOOK that npm Trusted Publishing must be enabled in npm package settings and linked to this GitHub repo.
