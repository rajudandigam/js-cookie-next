import type { CookieOptions } from "../types.js";

/**
 * Adapter: map CookieOptions to cookieStore API and perform get/set/delete.
 * TODO: Implement per docs/ARCH.md §7. SSR-safe; use only when cookieStore exists.
 */
export async function getCookie(_name: string): Promise<string | undefined> {
  return undefined;
}

export async function getAllCookies(): Promise<Record<string, string>> {
  return {};
}

export async function setCookie(
  _name: string,
  _value: string,
  _options?: CookieOptions
): Promise<void> {
  // Stub: no-op.
}

export async function deleteCookie(
  _name: string,
  _options?: CookieOptions
): Promise<void> {
  // Stub: no-op.
}
