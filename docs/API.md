📦 js-cookie-next
Public API Specification (MVP – v1)

1️⃣ Import Strategy
Supports both named and default export.
Recommended (Named Imports)
import {
 get,
 set,
 remove,
 getAsync,
 setAsync,
 removeAsync
} from "js-cookie-next"
Default Export (Compatibility Mode)
import Cookies from "js-cookie-next"

Cookies.get("theme")
Cookies.set("token", "123")
The default export is a simple object wrapper over named exports.

2️⃣ Sync API
These APIs always use document.cookie.
They are synchronous.

2.1 get
Signature
function get(name: string): string | undefined
function get(): Record<string, string>
Behavior
If name provided → returns decoded string value


If no argument → returns object map of all cookies


Returns undefined if cookie does not exist


Never throws for missing cookies


Examples
get("theme")
// "dark"

get()
// { theme: "dark", token: "abc" }

2.2 set
Signature
function set(
 name: string,
 value: string,
 options?: CookieOptions
): void
Behavior
Serializes cookie string


Applies attributes


Writes to document.cookie


Does not verify browser acceptance


Does not throw if rejected by browser


Example
set("theme", "dark", {
 path: "/",
 secure: true,
 sameSite: "lax"
})

2.3 remove
Signature
function remove(
 name: string,
 options?: CookieOptions
): void
Behavior
Sets cookie expiration to Unix epoch


Must match original path/domain to succeed


Does not throw if deletion fails


Example
remove("theme", { path: "/" })

3️⃣ Async API (Native-First)
These APIs:
Use cookieStore if available


Fall back to sync implementation wrapped in Promise


Always return Promise


Never reject because cookieStore missing



3.1 getAsync
Signature
function getAsync(name: string): Promise<string | undefined>
function getAsync(): Promise<Record<string, string>>
Behavior
Uses cookieStore.get() when supported


Falls back to sync get() if not


Always resolves


Example
const token = await getAsync("token")

3.2 setAsync
Signature
function setAsync(
 name: string,
 value: string,
 options?: CookieOptions
): Promise<void>
Behavior
Uses cookieStore.set() if available


Falls back to sync set() otherwise


Always resolves


Never rejects due to lack of native support



3.3 removeAsync
Signature
function removeAsync(
 name: string,
 options?: CookieOptions
): Promise<void>
Behavior
Uses cookieStore.delete() if available


Falls back to sync remove()


Always resolves



4️⃣ CookieOptions Type
export interface CookieOptions {
 path?: string
 domain?: string
 expires?: Date | number
 maxAge?: number
 secure?: boolean
 sameSite?: "lax" | "strict" | "none"
 partitioned?: boolean
 priority?: "low" | "medium" | "high"

 mode?: "default" | "partitioned"

 [key: string]: string | number | boolean | undefined
}

5️⃣ CHIPS Preset Behavior
If:
mode: "partitioned"
Then defaults applied:
partitioned = true
secure = true
sameSite = "none"
Rules:
Explicit user values override preset


Preset does not detect third-party context


Preset does not guarantee browser acceptance


No runtime mutation of user intent beyond preset defaults



6️⃣ Attribute Behavior Rules
Option
Behavior
expires: number
Treated as days
expires: Date
Converted to UTC string
maxAge
Max-Age= seconds
secure: true
Appends Secure
sameSite
Appends SameSite=
partitioned
Appends Partitioned
priority
Appends Priority=

Undefined options are ignored.

7️⃣ Dev-Mode Warning
In non-production builds:
If:
sameSite === "none" && secure !== true
Then:
console.warn(...)
Only warning.
 Never auto-fix.
 Never throw.

8️⃣ Behavior Guarantees
8.1 No Side Effects
Library does not modify globals


Does not cache cookies


Does not subscribe to change events



8.2 SSR Safety
Importing the library does not access document


Calling sync methods in Node safely no-ops or returns undefined



8.3 Deterministic Fallback
Async methods:
if cookieStore exists:
   use native
else:
   fallback to sync
Always deterministic.

9️⃣ Error Handling Contract
The library throws only if:
name is not string


value is not string


options invalid type


Never throws because:
Browser rejects cookie


cookieStore unavailable


Deletion fails silently



🔟 Complete Public Surface
This is the full public contract:
get
set
remove

getAsync
setAsync
removeAsync

type CookieOptions
default export object
No hidden helpers.
 No feature detection exports.
 No internal adapters exported.

1️⃣1️⃣ Migration Story (From js-cookie)
Old:
import Cookies from "js-cookie"
Cookies.set("theme", "dark")
New:
import Cookies from "js-cookie-next"
Cookies.set("theme", "dark")
Optional async upgrade:
await Cookies.setAsync("token", value)

🏁 Final API Assessment
This API is:
Minimal


Familiar


Type-safe


Native-first


CHIPS-aware


Explicit


Predictable


Backward-friendly


Honest about browser behavior


It maintains:
✔ js-cookie mental model
 ✔ Async future path
 ✔ Privacy-safe presets
 ✔ Deterministic fallback
 ✔ Zero dependency surface

