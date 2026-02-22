import type { CookieOptions } from "../types.js";

/** SSR-safe; no throw. */
function getCookieStore(): CookieStore | undefined {
  if (typeof globalThis === "undefined") return undefined;
  const g = globalThis as unknown as { cookieStore?: CookieStore };
  return g.cookieStore;
}

/**
 * Map CookieOptions to CookieStore-set shape. Only supported keys; ignore rest.
 * expires: number → days from now; Date → as-is. Invalid/NaN expires omitted.
 * Does not mutate options.
 */
function toCookieStoreOptions(
  name: string,
  value: string,
  options?: CookieOptions
): Record<string, unknown> {
  const out: Record<string, unknown> = { name, value };
  if (options == null) return out;

  if (typeof options.domain === "string") out.domain = options.domain;
  if (typeof options.path === "string") out.path = options.path;

  if (options.expires !== undefined) {
    let expiresDate: Date;
    if (typeof options.expires === "number") {
      if (Number.isFinite(options.expires)) {
        expiresDate = new Date(Date.now() + options.expires * 864e5);
        out.expires = expiresDate;
      }
    } else if (options.expires instanceof Date && Number.isFinite(options.expires.getTime())) {
      out.expires = options.expires;
    }
  }

  if (
    options.sameSite === "lax" ||
    options.sameSite === "strict" ||
    options.sameSite === "none"
  ) {
    out.sameSite = options.sameSite;
  }
  if (typeof options.secure === "boolean") out.secure = options.secure;
  if (typeof options.partitioned === "boolean") out.partitioned = options.partitioned;

  return out;
}

export async function getCookie(name: string): Promise<string | undefined> {
  const store = getCookieStore();
  if (store == null) return undefined;
  const result = await store.get(name);
  if (result == null) return undefined;
  return result.value;
}

export async function getAllCookies(): Promise<Record<string, string>> {
  const store = getCookieStore();
  if (store == null) return {};
  const list = await store.getAll();
  const map: Record<string, string> = {};
  for (const cookie of list) {
    const n = cookie.name;
    const v = cookie.value;
    if (typeof n === "string" && typeof v === "string") map[n] = v;
  }
  return map;
}

export async function setCookie(
  name: string,
  value: string,
  options?: CookieOptions
): Promise<void> {
  const store = getCookieStore();
  if (store == null) return;
  const mapped = toCookieStoreOptions(name, value, options);
  await store.set(mapped as any);
}

export async function deleteCookie(
  name: string,
  options?: CookieOptions
): Promise<void> {
  const store = getCookieStore();
  if (store == null) return;
  const opts: { name: string; domain?: string; path?: string } = { name };
  if (options != null) {
    if (typeof options.domain === "string") opts.domain = options.domain;
    if (typeof options.path === "string") opts.path = options.path;
  }
  await store.delete(opts);
}
