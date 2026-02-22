import { parse } from "./parse.js";

/**
 * Sync get: read cookie(s) from document.cookie.
 * Per docs/API.md and docs/ARCH.md §6. SSR-safe (no top-level document). Never throws.
 */
export function get(): Record<string, string>;
export function get(name: string): string | undefined;
export function get(name?: string): Record<string, string> | string | undefined {
  if (typeof document === "undefined") {
    return name === undefined ? {} : undefined;
  }
  const raw = document.cookie;
  const parsed = parse(raw);
  if (name === undefined) return parsed;
  return parsed[name];
}
