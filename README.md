# js-cookie-next

Native-first, TypeScript-first cookie utility for modern browsers.

- Async Cookie Store API support
- `document.cookie` fallback
- Partitioned (CHIPS) preset
- Zero dependencies
- < 2 KB gzipped
- SSR-safe import

---

## Installation

```bash
npm install js-cookie-next
```

Supports both ESM and CommonJS automatically via the package exports map.

## Basic Usage (Sync API)

```js
import { get, set, remove } from "js-cookie-next";

set("theme", "dark", { path: "/", sameSite: "lax" });

console.log(get("theme")); // "dark"

remove("theme", { path: "/" });
```

`get()` returns `undefined` if the cookie does not exist.

`remove()` must match the same path and domain used when setting.

## Async API

If `window.cookieStore` is available, the async API uses it. Otherwise, it falls back to the sync implementation.

```js
import { setAsync, getAsync, removeAsync } from "js-cookie-next";

await setAsync("token", "abc123");

const token = await getAsync("token");

await removeAsync("token");
```

The fallback behavior is deterministic and does not change the public API.

## Partitioned (CHIPS) Mode

For third-party contexts requiring partitioned cookies:

```js
set("widget_session", "xyz", { mode: "partitioned" });
```

This expands to:

- `partitioned: true`
- `secure: true`
- `sameSite: "none"`

Browser support varies. This preset ensures required attributes are applied but does not guarantee acceptance.

## CookieOptions

```ts
interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: number | Date;
  maxAge?: number;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  partitioned?: boolean;
  priority?: "low" | "medium" | "high";
  mode?: "partitioned";
}
```

- `expires` as a number represents days from now.
- `mode: "partitioned"` applies the recommended preset for partitioned cookies.
- Unsupported attributes are ignored in async CookieStore mode.

## Behavior Notes

- Removal must match the same path and domain used during set.
- `sameSite: "none"` requires `secure: true` in modern browsers.
- Partitioned cookies depend on browser support.
- Importing the library is safe in SSR environments.
- Sync APIs are no-ops when `document` is undefined.

## Size

- < 2 KB gzipped
- Zero runtime dependencies

## Comparison

| Feature | js-cookie | js-cookie-next |
|---------|-----------|----------------|
| Sync API | ✓ | ✓ |
| Async CookieStore | ✗ | ✓ |
| Partitioned preset | ✗ | ✓ |
| TypeScript-first | ✗ | ✓ |
| Zero dependencies | ✓ | ✓ |

## License

MIT
