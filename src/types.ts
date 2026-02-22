/**
 * Cookie attributes and options. See docs/API.md for full spec.
 */
export interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date | number;
  maxAge?: number;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  partitioned?: boolean;
  priority?: "low" | "medium" | "high";
  mode?: "default" | "partitioned";
  [key: string]: string | number | boolean | Date | undefined;
}
