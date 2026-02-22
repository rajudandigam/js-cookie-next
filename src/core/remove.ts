import type { CookieOptions } from "../types.js";
import { normalizeOptions } from "./normalizeOptions.js";
import { serialize } from "./serialize.js";

/**
 * Sync remove: expire cookie (must match path/domain).
 * Per docs/API.md and docs/ARCH.md §6.4. SSR-safe (no top-level document).
 */
export function remove(name: string, options?: CookieOptions): void {
  if (typeof document === "undefined") return;

  if (typeof name !== "string") throw new TypeError("name must be a string");

  const normalized = normalizeOptions(options);
  const removalOptions: CookieOptions = {
    ...normalized,
    expires: new Date(0),
  };
  const cookieString = serialize(name, "", removalOptions);
  document.cookie = cookieString;
}
