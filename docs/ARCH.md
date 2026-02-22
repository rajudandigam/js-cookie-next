
🏗️ Final Architecture Document
js-cookie-next – MVP (Phase 1)
This is the internal reference document to be used by Cursor as the authoritative blueprint.
It defines:
Internal module boundaries
Sync pipeline
Async adapter layer
Native detection
CHIPS preset logic
Attribute normalization
Fallback guarantees
Error-handling philosophy
Behavior contract
Testing model
Performance discipline
DX guarantees
Bundle rules
Future extension points
This follows the same rigor level as your tooltip rewrite architecture.

1️⃣ Architectural Principles
1. Native-first, fallback-safe
Use window.cookieStore when available.
Always fall back to document.cookie.
Never assume availability.
Never polyfill CookieStore.

2. Zero runtime dependencies
No cookie (jshttp)
No polyfills
No heavy parsers
Internal serializer only

3. Deterministic behavior
No auto-mutation of user options.
Presets apply defaults, but explicit user values override.
No silent runtime “fixing.”

4. SSR-safe
No document access at import time.
All browser access guarded inside functions.
Safe import in Node environments.

5. Tiny & tree-shakable
Target: < 2KB gzipped
Pure ESM core
No side effects

6. No compliance theater
Library provides primitives.
Does not promise third-party cookie success.
Does not auto-detect third-party context.

2️⃣ High-Level Architecture Overview
┌────────────────────────────────┐
│ Application Code               │
│                                │
│ get / set / remove             │
│ getAsync / setAsync / removeAsync
│                                │
└──────────────┬─────────────────┘
               ▼
        Core API Layer
               │
               ▼
        Strategy Resolver
      (native vs fallback)
               │
        ┌──────┴────────┐
        ▼               ▼
   Native Adapter    Sync Adapter
  (cookieStore)     (document.cookie)


3️⃣ Internal Module Structure
src/
 ├── core/
 │    ├── get.ts
 │    ├── set.ts
 │    ├── remove.ts
 │    ├── parse.ts
 │    ├── serialize.ts
 │    └── normalizeOptions.ts
 │
 ├── async/
 │    ├── detectCookieStore.ts
 │    ├── cookieStoreAdapter.ts
 │    └── asyncApi.ts
 │
 ├── types.ts
 ├── devWarnings.ts
 └── index.ts

Strict separation:
core/ = sync implementation
async/ = native-first layer
No cross-layer leakage

4️⃣ Strategy Resolution
Strategy Model
Implicit, not configurable.
Async methods:
if cookieStore exists:
    use Native Adapter
else:
    fallback to sync

Sync methods:
Always use document.cookie.
No manual override flag in MVP.

5️⃣ Feature Detection Layer
export const hasCookieStore =
  typeof globalThis !== "undefined" &&
  "cookieStore" in globalThis

Rules:
Detection happens lazily.
No eager access.
No try/catch detection at import.

6️⃣ Sync Adapter (Core of Library)
Responsibilities
Read cookies
Write cookies
Remove cookies
Serialize attributes correctly
Normalize CHIPS preset
Maintain js-cookie behavioral parity

6.1 Parsing Model
Parsing must:
Split on ;
Trim whitespace
Decode URI components
Return object map
Edge cases:
Empty cookie string → empty object
Duplicate names → last one wins (browser behavior)

6.2 Serialization Model
Must support:
Attribute
Behavior
path
default "/"
domain
appended
expires
convert Date → UTC string
maxAge
Max-Age= seconds
secure
append Secure
sameSite
append SameSite=
partitioned
append Partitioned
priority
append Priority=

Strict rules:
Booleans append attribute name only.
Undefined attributes skipped.
Custom attributes allowed.

6.3 Partitioned Mode Preset
If:
mode: 'partitioned'

Then apply defaults:
partitioned = true
secure = true
sameSite = 'none'

But:
Explicit user values override preset.
No runtime detection.
No environment heuristics.

6.4 Removal Contract
Removal sets:
expires: new Date(0)

Must match:
same path
same domain
Document clearly:
Mismatch → no deletion.

7️⃣ Async Adapter
Responsibilities
Use cookieStore.get
Use cookieStore.set
Use cookieStore.delete
Normalize options mapping

7.1 Option Mapping to CookieStore
CookieStore expects:
{
  name,
  value,
  domain?,
  path?,
  expires?,
  sameSite?,
  secure?,
  partitioned?
}

Mapping rules:
Convert days-based expires into Date.
Ignore unsupported attributes silently.
Do not throw for unknown attributes.

7.2 Fallback Behavior
If no cookieStore:
await Promise.resolve(syncImplementation())

Guarantees:
Async API always returns Promise.
Never throws because cookieStore missing.

8️⃣ Behavior Parity Contract
Feature
Sync
Async
get(name)
string
Promise
get()
object map
Promise
set
void
Promise
remove
void
Promise

No behavior drift allowed between strategies.

9️⃣ Dev Warning System (Optional)
Dev-only checks:
if sameSite === 'none' && secure !== true:
    console.warn(...)

Only in non-production build.
Guarded by:
if process.env.NODE_ENV !== 'production'

No runtime enforcement.

🔟 State & Lifecycle Model
Stateless library.
No internal global state.
No cookie caching.
No memoization.
Every call reflects current browser state.

1️⃣1️⃣ Error Handling Philosophy
Never throw unless:
Invalid input types (non-string name)
Illegal option types
Never throw for:
Browser rejection
Unsupported attributes
cookieStore absence
Silent browser rejection is documented, not trapped.

1️⃣2️⃣ Performance Model
Sync Path
One string read
One string write
O(n) split for parsing
Acceptable for small cookie jars.
Async Path
Browser-managed
No main thread string parsing (in supported browsers)
No polling.
No observers.
No event listeners.

1️⃣3️⃣ Testing Architecture
Unit Tests (Vitest)
Core coverage:
parse correctness
serialize formatting
mode preset merging
attribute precedence
removal matching
dev warnings
fallback logic
Coverage target: 95%+

Browser Tests (Playwright)
Matrix:
Browser
Sync
Async
Chromium
✅
✅
WebKit
✅
Fallback
Firefox
✅
Fallback

Tests:
set → get roundtrip
remove works
partitioned formatting applied
async returns Promise
fallback parity

1️⃣4️⃣ Bundle Discipline Rules
To maintain <2KB gzip:
No lodash
No jshttp cookie dependency
No external parser
No polyfills
No deep utility helpers
Code must remain flat and modular.

1️⃣5️⃣ DX Guarantees
No default export confusion (provide named + default)
TS types bundled
Autocomplete for CookieOptions
Safe SSR import
Clear migration guide

1️⃣6️⃣ Implementation Constraints
Strict rules for contributors:
No global side effects
No try/catch around document unless necessary
No feature detection at module scope
All feature detection inside functions
Keep core and async layers separate

1️⃣7️⃣ CI & Quality Gates
Must include:
Size limit check
Unit test coverage check
E2E browser smoke tests
Typecheck strict mode
ESM + CJS verification

1️⃣8️⃣ Security Considerations
No dynamic evaluation
No header parsing
No Set-Cookie parsing
No cross-domain hacks
No Storage Access API calls
Library manipulates only client-visible cookies.

1️⃣9️⃣ Future Extension Points (Phase 2+)
Architecturally compatible with:
watch(name, callback)
change subscription using cookieStore
pattern-based watchers
dev validation mode
optional SSR adapter package
optional Next adapter package
Without breaking API surface.

🏁 Final Architecture Assessment
This architecture is:
Native-first
Fallback-safe
Privacy-aware (CHIPS aligned)
Tiny & dependency-free
Strictly scoped
Production-ready
Bundle-disciplined
SSR-safe
Migration-friendly
Honest about limitations
It integrates:
✔ CookieStore async CRUD
✔ document.cookie fallback
✔ Partitioned preset mode
✔ Typed modern attributes
✔ Dev-mode validation
✔ Deterministic removal semantics
✔ Strict bundle discipline