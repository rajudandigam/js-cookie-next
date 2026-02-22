/**
 * Parse document.cookie-style string into a record of name -> value.
 * Per docs/ARCH.md §6.1. Pure function; no document access. Never throws for malformed input.
 */
export function parse(cookieString: string): Record<string, string> {
  if (typeof cookieString !== "string" || cookieString.length === 0) return {};

  const result: Record<string, string> = {};
  const segments = cookieString.split(";");

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (trimmed.length === 0) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const name = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();

    if (name.length === 0) continue;

    let decodedName: string;
    let decodedValue: string;
    try {
      decodedName = decodeURIComponent(name);
      decodedValue = decodeURIComponent(value);
    } catch {
      continue;
    }

    result[decodedName] = decodedValue;
  }

  return result;
}
