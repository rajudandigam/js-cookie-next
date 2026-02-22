import { describe, it, expect } from "vitest";
import type { CookieOptions } from "../../types.js";
import { normalizeOptions } from "../normalizeOptions.js";

describe("normalizeOptions", () => {
  it("returns empty object when undefined", () => {
    expect(normalizeOptions(undefined)).toEqual({});
  });

  it("returns empty object when null", () => {
    expect(normalizeOptions(null as unknown as CookieOptions)).toEqual({});
  });

  it("returns shallow copy (not same reference)", () => {
    const opts = { path: "/", secure: true };
    const result = normalizeOptions(opts);
    expect(result).not.toBe(opts);
    expect(result).toEqual({ path: "/", secure: true });
  });

  it("partitioned mode applies defaults", () => {
    expect(normalizeOptions({ mode: "partitioned" })).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: true,
      sameSite: "none",
    });
  });

  it("explicit partitioned=false overrides default", () => {
    expect(
      normalizeOptions({ mode: "partitioned", partitioned: false })
    ).toEqual({
      mode: "partitioned",
      partitioned: false,
      secure: true,
      sameSite: "none",
    });
  });

  it("explicit secure=false overrides default", () => {
    expect(normalizeOptions({ mode: "partitioned", secure: false })).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: false,
      sameSite: "none",
    });
  });

  it("explicit sameSite=\"lax\" overrides default", () => {
    expect(
      normalizeOptions({ mode: "partitioned", sameSite: "lax" })
    ).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: true,
      sameSite: "lax",
    });
  });

  it("non-partitioned mode leaves values untouched", () => {
    const opts = { mode: "default" as const, path: "/", domain: ".example.com" };
    const result = normalizeOptions(opts);
    expect(result).toEqual({ mode: "default", path: "/", domain: ".example.com" });
    expect(result.partitioned).toBeUndefined();
    expect(result.secure).toBeUndefined();
    expect(result.sameSite).toBeUndefined();
  });

  it("original input object not mutated", () => {
    const opts = { mode: "partitioned" as const };
    normalizeOptions(opts);
    expect(opts).toEqual({ mode: "partitioned" });
  });
});
