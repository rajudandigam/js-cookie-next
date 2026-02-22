import type { CookieOptions } from "../types.js";
import { get } from "../core/get.js";
import { set } from "../core/set.js";
import { remove } from "../core/remove.js";
import { hasCookieStore } from "./detectCookieStore.js";
import * as adapter from "./cookieStoreAdapter.js";

/**
 * Async get: cookieStore when available, else Promise.resolve(sync get).
 * Per docs/ARCH.md §7.2. SSR-safe.
 */
export function getAsync(): Promise<Record<string, string>>;
export function getAsync(name: string): Promise<string | undefined>;
export function getAsync(
  name?: string
): Promise<Record<string, string> | string | undefined> {
  if (hasCookieStore()) {
    if (name === undefined) return adapter.getAllCookies();
    return adapter.getCookie(name);
  }
  return Promise.resolve(name === undefined ? get() : get(name));
}

/**
 * Async set: cookieStore when available, else Promise.resolve(sync set).
 * Per docs/ARCH.md §7.2. SSR-safe.
 */
export function setAsync(
  name: string,
  value: string,
  options?: CookieOptions
): Promise<void> {
  if (hasCookieStore()) return adapter.setCookie(name, value, options);
  set(name, value, options);
  return Promise.resolve();
}

/**
 * Async remove: cookieStore when available, else Promise.resolve(sync remove).
 * Per docs/ARCH.md §7.2. SSR-safe.
 */
export function removeAsync(
  name: string,
  options?: CookieOptions
): Promise<void> {
  if (hasCookieStore()) return adapter.deleteCookie(name, options);
  remove(name, options);
  return Promise.resolve();
}
