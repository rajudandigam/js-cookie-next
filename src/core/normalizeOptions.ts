import type { CookieOptions } from "../types.js";

/**
 * Apply CHIPS preset (mode: "partitioned" → defaults). Explicit values override.
 * TODO: Implement per docs/ARCH.md §6.3. SSR-safe.
 */
export function normalizeOptions(options?: CookieOptions): CookieOptions {
  // Stub: return as-is.
  return options ?? {};
}
