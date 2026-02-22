import type { CookieOptions } from "../types.js";

/**
 * Serialize name, value, and options into a Set-Cookie-style string.
 * TODO: Implement per docs/ARCH.md §6.2. SSR-safe.
 */
export function serialize(
  _name: string,
  _value: string,
  _options?: CookieOptions
): string {
  // Stub: no logic yet.
  return "";
}
