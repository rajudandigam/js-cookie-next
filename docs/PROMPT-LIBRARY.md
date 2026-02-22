# Prompt library (Cursor prompts) — js-cookie-next

Use these prompts when implementing or changing modules. **Behavior and API:** docs/API.md and docs/ARCH.md (locked). **Structure and order:** docs/DEV-ARCHITECTURE.md.

---

## parse.ts

**Prompt:** Implement `parse(cookieString: string): Record<string, string>` in `src/core/parse.ts` per docs/ARCH.md §6.1. Split on `;`, trim whitespace, decode URI components, return object map. Edge cases: empty string → empty object; duplicate names → last wins. No top-level document access. Add Vitest unit tests for splitting, decoding, empty input, and duplicates.

---

## serialize.ts

**Prompt:** Implement cookie serialization in `src/core/serialize.ts` per docs/API.md and docs/ARCH.md §6.2. Build `name=value` plus attribute string (path, domain, expires, maxAge, secure, sameSite, partitioned, priority). Expires: Date → UTC string; number → days. Undefined options omitted. Add unit tests for each attribute and for edge cases (path default "/", boolean attributes).

---

## normalizeOptions.ts

**Prompt:** Implement `normalizeOptions(options?: CookieOptions): CookieOptions` in `src/core/normalizeOptions.ts` per docs/API.md and docs/ARCH.md §6.3. When `mode: "partitioned"`, apply defaults: `partitioned = true`, `secure = true`, `sameSite = "none"`. Explicit user values override preset. No runtime detection. Add unit tests for preset merge and explicit overrides.

---

## get / set / remove (sync)

**Prompt:** Implement `get`, `set`, `remove` in `src/core/get.ts`, `src/core/set.ts`, `src/core/remove.ts` per docs/API.md. Use `document.cookie` only inside functions; SSR-safe (no access at module top-level). get(name?) → string | Record | undefined; set(name, value, options?); remove(name, options?) with path/domain match. Use parse and serialize from core; use normalizeOptions for set. Add unit tests for get/set/remove, path/domain match for remove, and SSR (no document).

---

## Async adapter

**Prompt:** Implement async layer per docs/ARCH.md §5–7. (1) `src/async/detectCookieStore.ts`: lazy detection only, no top-level access; return boolean. (2) `src/async/cookieStoreAdapter.ts`: map CookieOptions to cookieStore shape; implement get/set/delete via cookieStore. (3) `src/async/asyncApi.ts`: getAsync, setAsync, removeAsync — use adapter when cookieStore available, else `Promise.resolve(syncImpl())`. Never reject due to missing cookieStore. Add unit tests: fallback when cookieStore undefined, native path with mocked cookieStore.

---

## index exports

**Prompt:** Implement `src/index.ts` per docs/API.md. Export: get, set, remove, getAsync, setAsync, removeAsync, CookieOptions. Provide default export object with those methods (compatibility mode). No new logic; re-export from core and async. Ensure default export matches named API.

---

## Tests

**Prompt:** Add or extend Vitest unit tests for [module name]. Use jsdom. Cover happy path, edge cases, and SSR where relevant. Mock document.cookie or cookieStore as needed. Do not use clipboard or OS-specific APIs. Target coverage for core/ and async/ per docs/DEV-ARCHITECTURE.md §6.

---

## Packaging

**Prompt:** Ensure package.json exports map has "." with types, import, and require. tsup.config.ts single entry for `src/index.ts`. Build outputs dist/index.mjs, dist/index.cjs, dist/index.d.ts. No runtime dependencies. Size limit for dist/index.mjs (see package.json; target < 2KB gzip).

---

## CI

**Prompt:** CI workflow: jobs typecheck, unit (with coverage artifact), size (after build), playwright (no-op until harness exists). Use Node 20, npm ci. Concurrency group on ref. No secrets. See docs/CI-PLAYBOOK.md.

---

## Release

**Prompt:** Release workflow: on push to main, run test:all then changesets/action with publish command `npm run release`. Permissions: contents write, pull-requests write, id-token write (OIDC). See docs/RELEASE-PLAYBOOK.md.
