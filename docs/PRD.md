js-cookie-next
Tagline:
The js-cookie API, modernized for 2026 — TypeScript-first, CHIPS-aware, and async-ready via Cookie Store API (with safe fallbacks).

1. Executive Summary
The cookie management ecosystem in 2026 is split between:
Legacy sync-only utilities (js-cookie, tiny-cookie)


Isomorphic/server wrappers (universal-cookie)


Framework-bound abstractions (cookies-next, Next.js headers API)


Raw native Cookie Store API (not universally supported)


There is currently no small, browser-first, TS-native library that:
Preserves the ergonomic simplicity of js-cookie


Provides async CRUD using window.cookieStore when available


Offers typed support for modern attributes including Partitioned (CHIPS)


Maintains strict fallback guarantees across browsers


js-cookie-next fills this gap.
It is not a compliance framework.
 It is not a server cookie library.
 It is not a polyfill.
It is a native-first, privacy-aware, browser utility with safe fallbacks.

2. Problem Statement
The 2026 Cookie Reality
document.cookie is synchronous and string-based.


Cookie Store API is async and event-driven — but not universally supported.
 (Secure contexts required; browser support uneven.)


CHIPS (Partitioned cookies) introduces strict attribute rules:


Partitioned requires Secure


SameSite=None required for cross-site usage


Silent rejection is common if misconfigured.


Existing libraries:
Library
Limitation
js-cookie
Sync only, no async API, no first-class CHIPS helpers
universal-cookie
Larger surface area, SSR focus, no async CRUD
cookies-next
Framework-bound
Raw cookieStore
No fallback parity

There is no drop-in, tiny, modernized js-cookie successor.

3. Product Vision
Modernize the js-cookie mental model without breaking it.
Principles:
Zero runtime dependencies


< 2KB min+gz target


Strict fallback guarantees


No magic


No auto-detection hacks


No policy speculation


No breaking surprises



4. Target Users
Frontend engineers managing cookies in browser apps


SDK/widget authors embedding cross-site


Teams migrating from js-cookie


Privacy-conscious architects needing typed CHIPS support


Not targeting:
Node-only cookie parsing


Server middleware


Consent management platforms



5. Goals (v1)
Functional Goals
Provide sync API parity with js-cookie


Provide async API variants backed by Cookie Store API


Provide typed support for modern attributes


Provide optional “partitioned mode” preset


Be fully SSR-safe (no top-level document access)


Maintain tiny footprint (< 2KB gzipped)


Non-Goals
No Storage Access API automation


No third-party detection logic


No consent UI helpers


No cookie change subscription API in v1


No framework-specific integrations


No auto-fixing misconfigurations silently



6. API Design
6.1 Sync API (js-cookie compatible)
get(name?: string): string | Record<string, string> | undefined
set(name: string, value: string, attrs?: CookieOptions): void
remove(name: string, attrs?: CookieOptions): void
Behavior:
Uses document.cookie


Safe no-op if document unavailable (SSR)



6.2 Async API (Native-first)
getAsync(name?: string): Promise<string | Record<string, string> | undefined>
setAsync(name: string, value: string, attrs?: CookieOptions): Promise<void>
removeAsync(name: string, attrs?: CookieOptions): Promise<void>
Behavior contract:
IF globalThis.cookieStore exists:
Use cookieStore.get


Use cookieStore.set


Use cookieStore.delete


ELSE:
Fallback to sync implementation


Wrap in Promise.resolve


No polyfill injection.
 No assumptions about availability.

7. CookieOptions Type
interface CookieOptions {
 path?: string
 domain?: string
 expires?: Date | number
 maxAge?: number
 secure?: boolean
 sameSite?: 'lax' | 'strict' | 'none'
 partitioned?: boolean
 priority?: 'low' | 'medium' | 'high'
 mode?: 'default' | 'partitioned'
 [key: string]: string | number | boolean | undefined
}

8. Partitioned Mode (CHIPS Preset)
If:
mode: 'partitioned'
Then default:
partitioned = true


secure = true


sameSite = 'none'


Rules:
Explicit user overrides win.


No runtime detection of third-party context.


No guarantee of browser acceptance.


Documentation explains behavior clearly.


This prevents silent rejection caused by missing required attributes.

9. Edge Case Guarantees
9.1 Removal Guarantee
remove(name, attrs) must match:
same path


same domain


Document clearly:
 Removal fails silently if mismatch (browser rule).

9.2 SameSite=None Safety
Optional dev-only warning:
 If:
sameSite: 'none' && secure !== true
Emit console.warn in development mode only.
No runtime mutation.

10. Differentiation Strategy
Feature
js-cookie
universal-cookie
js-cookie-next
Sync API
✅
✅
✅
Async CRUD
❌
❌
✅
CookieStore support
❌
Partial (events)
Full CRUD (best-effort)
Partitioned typing
❌
✅
✅ (with preset mode)
Zero deps
✅
❌
✅
SSR-safe import
⚠️
✅
✅
Framework locked
❌
❌
❌


11. Known Limitations
Partitioned cookies are browser dependent.


Async API requires secure context.


CookieStore may not exist in Safari/Firefox.


Library cannot detect when third-party context requires CHIPS.


Cookie rejection may still occur silently.


Cannot override browser privacy policies.



12. Implementation Blueprint
Architecture
src/
├── core/
│    ├── parse.ts
│    ├── serialize.ts
│    ├── sync.ts
│    └── remove.ts
├── async/
│    ├── cookieStoreAdapter.ts
│    └── asyncApi.ts
├── types.ts
└── index.ts
Design:
No global access at import time


All browser access guarded inside functions


cookieStore detection done lazily



13. Testing Requirements
Unit Tests (Vitest)
parse logic


serialize logic


attribute formatting


partitioned mode merging


removal semantics


fallback logic when cookieStore undefined


Browser Tests (Playwright)
Chromium


WebKit


Firefox


Test matrix:
sync API works everywhere


async API works where cookieStore exists


async fallback works when not


partitioned formatting applied correctly



14. Performance & Size Targets
Bundle size < 2KB gzipped


No runtime dependencies


Tree-shakable


ESM + CJS + types



15. Security & Stability Rules
No dynamic eval


No reflection


No side effects


No global mutation


Strict semantic versioning



16. Migration Guide Strategy
README must include:
From js-cookie
import Cookies from 'js-cookie'
Becomes:
import { get, set, remove } from 'js-cookie-next'
or provide default export wrapper for easier drop-in.
Async optional upgrade path:
await setAsync('token', value)

17. Future Roadmap (v2+)
Only if v1 adoption is strong:
watch() API


Cookie change subscriptions


Dev-only validation mode


Optional Next adapter (separate package)



18. Final Strategic Positioning
We are NOT:
Competing with Next.js cookies API


Replacing universal-cookie SSR use cases


Promising compliance automation


We ARE:
A modern successor to js-cookie


A tiny native-first cookie utility


A CHIPS-aware browser library


An async-ready wrapper with strict fallback guarantees



19. Why This Has Real Adoption Potential
js-cookie ~14M weekly downloads


CookieStore API growing


CHIPS complexity increasing


No tiny modern drop-in alternative exists


This is not speculative.
 This is evolutionary modernization.



