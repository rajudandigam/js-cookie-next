import type { CookieOptions } from "../types.js";

/**
 * Apply CHIPS preset (mode: "partitioned" → defaults). Explicit values override.
 * Per docs/ARCH.md §6.3 and docs/API.md §5. SSR-safe.
 */
export function normalizeOptions(options?: CookieOptions): CookieOptions {
  if (options == null) return {};
  const result: CookieOptions = { ...options };
  if (result.mode === "partitioned") {
    if (result.partitioned === undefined) result.partitioned = true;
    if (result.secure === undefined) result.secure = true;
    if (result.sameSite === undefined) result.sameSite = "none";
  }
  return result;
}
