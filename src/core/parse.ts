/**
 * Parse document.cookie-style string into a record of name -> value.
 * TODO: Implement per docs/ARCH.md §6.1. SSR-safe (no top-level document).
 */
export function parse(cookieString: string): Record<string, string> {
  // Stub: no logic yet.
  if (typeof cookieString !== "string") return {};
  return {};
}
