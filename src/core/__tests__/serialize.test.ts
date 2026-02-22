import { describe, it, expect, vi } from "vitest";
import type { CookieOptions } from "../../types.js";
import { serialize } from "../serialize.js";

describe("serialize", () => {
  it("basic name=value", () => {
    expect(serialize("foo", "bar")).toBe("foo=bar");
  });

  it("encodes name and value", () => {
    expect(serialize("a b", "x=y")).toBe(
      "a%20b=x%3Dy"
    );
  });

  it("path + domain formatting", () => {
    expect(
      serialize("n", "v", { path: "/", domain: ".example.com" })
    ).toBe("n=v; Path=/; Domain=.example.com");
  });

  it("expires number converts to correct UTC string (mock Date.now)", () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-01-15T12:00:00.000Z").getTime());
    const out = serialize("n", "v", { expires: 1 });
    expect(out).toMatch(/^n=v; Expires=/);
    expect(out).toContain("Expires=Fri, 16 Jan 2026 12:00:00 GMT");
    vi.restoreAllMocks();
  });

  it("expires Date", () => {
    const d = new Date("2030-06-01T00:00:00.000Z");
    expect(serialize("n", "v", { expires: d })).toBe(
      "n=v; Expires=Sat, 01 Jun 2030 00:00:00 GMT"
    );
  });

  it("maxAge formatting", () => {
    expect(serialize("n", "v", { maxAge: 3600 })).toBe("n=v; Max-Age=3600");
  });

  it("secure flag", () => {
    expect(serialize("n", "v", { secure: true })).toBe("n=v; Secure");
  });

  it("sameSite formatting", () => {
    expect(serialize("n", "v", { sameSite: "lax" })).toBe("n=v; SameSite=lax");
    expect(serialize("n", "v", { sameSite: "strict" })).toBe("n=v; SameSite=strict");
    expect(serialize("n", "v", { sameSite: "none" })).toBe("n=v; SameSite=none");
  });

  it("partitioned formatting", () => {
    expect(serialize("n", "v", { partitioned: true })).toBe("n=v; Partitioned");
  });

  it("priority formatting", () => {
    expect(serialize("n", "v", { priority: "high" })).toBe("n=v; Priority=high");
    expect(serialize("n", "v", { priority: "low" })).toBe("n=v; Priority=low");
  });

  it("unknown attribute string", () => {
    expect(serialize("n", "v", { customAttr: "x" } as CookieOptions)).toBe(
      "n=v; customAttr=x"
    );
  });

  it("unknown attribute boolean true", () => {
    expect(serialize("n", "v", { httpOnly: true } as CookieOptions)).toBe(
      "n=v; httpOnly"
    );
  });

  it("unknown attribute boolean false ignored", () => {
    expect(serialize("n", "v", { httpOnly: false } as CookieOptions)).toBe("n=v");
  });

  it("options undefined", () => {
    expect(serialize("a", "b")).toBe("a=b");
    expect(serialize("a", "b", undefined)).toBe("a=b");
  });

  it("throws when name not string", () => {
    expect(() => serialize(1 as unknown as string, "v")).toThrow(TypeError);
    expect(() => serialize(1 as unknown as string, "v")).toThrow("name must be a string");
  });

  it("throws when value not string", () => {
    expect(() => serialize("n", 2 as unknown as string)).toThrow(TypeError);
    expect(() => serialize("n", 2 as unknown as string)).toThrow("value must be a string");
  });
});
