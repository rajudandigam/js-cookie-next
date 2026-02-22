import type { CookieOptions } from "../types.js";

const KNOWN_KEYS = new Set([
  "path",
  "domain",
  "expires",
  "maxAge",
  "secure",
  "sameSite",
  "partitioned",
  "priority",
  "mode",
]);

/**
 * Serialize name, value, and options into a Set-Cookie-style string.
 * Per docs/API.md §6 and docs/ARCH.md §6.2. SSR-safe. Does not mutate options.
 */
export function serialize(
  name: string,
  value: string,
  options?: CookieOptions
): string {
  if (typeof name !== "string") throw new TypeError("name must be a string");
  if (typeof value !== "string")
    throw new TypeError("value must be a string");

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  const parts: string[] = [`${encodedName}=${encodedValue}`];

  if (options == null) return parts[0];

  const opts = options as Record<string, string | number | boolean | Date | undefined>;

  if (typeof opts.path === "string") parts.push(`Path=${opts.path}`);
  if (typeof opts.domain === "string") parts.push(`Domain=${opts.domain}`);

  if (opts.expires !== undefined) {
    let expiresDate: Date;
    if (typeof opts.expires === "number") {
      expiresDate = new Date(Date.now() + opts.expires * 864e5);
    } else if (opts.expires instanceof Date) {
      expiresDate = opts.expires;
    } else {
      expiresDate = new Date(Date.now() + Number(opts.expires) * 864e5);
    }
    parts.push(`Expires=${expiresDate.toUTCString()}`);
  }

  if (typeof opts.maxAge === "number") parts.push(`Max-Age=${opts.maxAge}`);
  if (opts.secure === true) parts.push("Secure");
  if (
    opts.sameSite === "lax" ||
    opts.sameSite === "strict" ||
    opts.sameSite === "none"
  ) {
    parts.push(`SameSite=${opts.sameSite}`);
  }
  if (opts.partitioned === true) parts.push("Partitioned");
  if (
    opts.priority === "low" ||
    opts.priority === "medium" ||
    opts.priority === "high"
  ) {
    parts.push(`Priority=${opts.priority}`);
  }

  for (const key of Object.keys(opts)) {
    if (KNOWN_KEYS.has(key)) continue;
    const v = opts[key];
    if (v === undefined || v === false) continue;
    if (v === true) parts.push(key);
    else if (typeof v === "string" || typeof v === "number")
      parts.push(`${key}=${v}`);
  }

  return parts.join("; ");
}
