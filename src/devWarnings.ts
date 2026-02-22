/**
 * Dev-only warnings (e.g. sameSite=none without secure).
 * TODO: Implement per docs/API.md §7. No-op in production. SSR-safe.
 */
export function checkSameSiteNoneSecure(_options?: {
  sameSite?: string;
  secure?: boolean;
}): void {
  // Stub: no-op.
}
