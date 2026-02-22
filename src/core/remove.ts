import type { CookieOptions } from "../types.js";

/**
 * Sync remove: expire cookie (must match path/domain).
 * TODO: Implement per docs/API.md. SSR-safe (no top-level document).
 */
export function remove(_name: string, _options?: CookieOptions): void {
  // Stub: no-op.
}
