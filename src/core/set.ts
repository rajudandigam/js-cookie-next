import type { CookieOptions } from "../types.js";

/**
 * Sync set: write cookie via document.cookie.
 * TODO: Implement per docs/API.md. SSR-safe (no top-level document).
 */
export function set(
  _name: string,
  _value: string,
  _options?: CookieOptions
): void {
  // Stub: no-op.
}
