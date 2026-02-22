/**
 * Sync get: read cookie(s) from document.cookie.
 * TODO: Implement per docs/API.md. SSR-safe (no top-level document).
 */
export function get(): Record<string, string>;
export function get(name: string): string | undefined;
export function get(name?: string): Record<string, string> | string | undefined {
  // Stub: no logic yet.
  if (name === undefined) return {};
  return undefined;
}
