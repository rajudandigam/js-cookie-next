/**
 * Lazy detection of cookieStore availability. No top-level access (SSR-safe).
 * TODO: Implement per docs/ARCH.md §5.
 */
export function hasCookieStore(): boolean {
  if (typeof globalThis === "undefined") return false;
  return "cookieStore" in globalThis;
}
