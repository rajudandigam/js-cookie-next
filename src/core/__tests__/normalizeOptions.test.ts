import { describe, it, expect } from "vitest";
import type { CookieOptions } from "../../types.js";
import { normalizeOptions } from "../normalizeOptions.js";

describe("normalizeOptions", () => {
  it("returns empty object when options is undefined", () => {
    expect(normalizeOptions(undefined)).toEqual({});
  });

  it("returns empty object when options is null", () => {
    expect(normalizeOptions(null as unknown as CookieOptions)).toEqual({});
  });

  it("returns copy of options when mode is undefined", () => {
    const opts = { path: "/", secure: true };
    expect(normalizeOptions(opts)).toEqual({ path: "/", secure: true });
    expect(normalizeOptions(opts)).not.toBe(opts);
  });

  it("returns copy of options when mode is default", () => {
    const opts = { mode: "default" as const, path: "/" };
    expect(normalizeOptions(opts)).toEqual({ mode: "default", path: "/" });
  });

  it("applies partitioned preset when mode is partitioned and attrs missing", () => {
    expect(normalizeOptions({ mode: "partitioned" })).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: true,
      sameSite: "none",
    });
  });

  it("explicit partitioned overrides preset", () => {
    expect(
      normalizeOptions({ mode: "partitioned", partitioned: false })
    ).toEqual({
      mode: "partitioned",
      partitioned: false,
      secure: true,
      sameSite: "none",
    });
  });

  it("explicit secure overrides preset", () => {
    expect(normalizeOptions({ mode: "partitioned", secure: false })).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: false,
      sameSite: "none",
    });
  });

  it("explicit sameSite overrides preset", () => {
    expect(
      normalizeOptions({ mode: "partitioned", sameSite: "lax" })
    ).toEqual({
      mode: "partitioned",
      partitioned: true,
      secure: true,
      sameSite: "lax",
    });
  });

  it("all three explicit override preset", () => {
    expect(
      normalizeOptions({
        mode: "partitioned",
        partitioned: false,
        secure: false,
        sameSite: "strict",
      })
    ).toEqual({
      mode: "partitioned",
      partitioned: false,
      secure: false,
      sameSite: "strict",
    });
  });

  it("does not mutate input", () => {
    const opts = { mode: "partitioned" as const };
    normalizeOptions(opts);
    expect(opts).toEqual({ mode: "partitioned" });
  });
});
