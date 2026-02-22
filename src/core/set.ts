import type { CookieOptions } from "../types.js";
import { normalizeOptions } from "./normalizeOptions.js";
import { serialize } from "./serialize.js";

/**
 * Sync set: write cookie via document.cookie.
 * Per docs/API.md and docs/ARCH.md §6.2, §6.3. SSR-safe (no top-level document).
 */
export function set(
  name: string,
  value: string,
  options?: CookieOptions
): void {
  if (typeof document === "undefined") return;

  if (typeof name !== "string") throw new TypeError("name must be a string");
  if (typeof value !== "string")
    throw new TypeError("value must be a string");

  const normalized = normalizeOptions(options);

  const isDev =
  typeof process !== "undefined" &&
  process.env?.NODE_ENV !== "production";

if (
  isDev &&
  normalized.sameSite === "none" &&
  normalized.secure !== true
) {
  console.warn(
    "[js-cookie-next] sameSite=none requires secure=true for cookies to work in cross-site contexts."
  );
}

  const cookieString = serialize(name, value, normalized);
  document.cookie = cookieString;
}
