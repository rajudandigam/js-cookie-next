# js-cookie-next

Native-first, TypeScript-first cookie utility for modern browsers.

- Async Cookie Store API support
- `document.cookie` fallback
- Partitioned (CHIPS) preset
- Zero dependencies
- < 2 KB gzipped
- SSR-safe import

## Installation

```bash
npm install js-cookie-next
```

## Basic Usage (Sync API)

```js
import { get, set, remove } from "js-cookie-next";

set("theme", "dark", { path: "/", sameSite: "lax" });

console.log(get("theme")); // "dark"

remove("theme", { path: "/" });
```

`get()` returns `undefined` if the cookie does not exist. `remove()` must match the same path and domain used when setting.

## Async API

If `window.cookieStore` is available, the async API uses it. Otherwise, it falls back to the sync implementation.

```js
import { setAsync, getAsync, removeAsync } from "js-cookie-next";

await setAsync("token", "abc123");

const token = await getAsync("token");

await removeAsync("token");
```

## Partitioned (CHIPS) Mode

```js
set("widget_session", "xyz", { mode: "partitioned" });
```

Expands to `partitioned: true`, `secure: true`, `sameSite: "none"`. Partitioned support depends on browser support.

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

`expires` as a number is days from now. `mode: "partitioned"` applies the preset.

## Behavior Notes

- Removal must match path and domain used when setting.
- `sameSite: "none"` requires `secure: true` in modern browsers.
- Import is SSR-safe; sync APIs are no-ops when `document` is undefined.

## Size

< 2 KB gzipped

## License

MIT
