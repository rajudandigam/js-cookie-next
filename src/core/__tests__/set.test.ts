import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { set } from "../set.js";

describe("set", () => {
  let cookieValue: string;
  let documentDescriptor: PropertyDescriptor | undefined;

  beforeEach(() => {
    cookieValue = "";
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (documentDescriptor) {
      Object.defineProperty(globalThis, "document", documentDescriptor);
    }
  });

  it("SSR no-op", () => {
    vi.stubGlobal("document", undefined);
    expect(() => set("a", "b")).not.toThrow();
  });

  it("writes correct serialized string", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    set("foo", "bar", { path: "/" });
    expect(cookieValue).toBe("foo=bar; Path=/");
  });

  it("normalizeOptions applied before serialize", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    set("n", "v", { mode: "partitioned" });
    expect(cookieValue).toContain("Partitioned");
    expect(cookieValue).toContain("Secure");
    expect(cookieValue).toContain("SameSite=none");
  });

  it("sameSite none without secure triggers console.warn in dev", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    set("n", "v", { sameSite: "none" });
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("sameSite=none")
    );
    process.env.NODE_ENV = env;
    warnSpy.mockRestore();
  });

  it("no warn in production", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const env = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    set("n", "v", { sameSite: "none" });
    expect(warnSpy).not.toHaveBeenCalled();
    process.env.NODE_ENV = env;
    warnSpy.mockRestore();
  });

  it("throws if name not string", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    expect(() => set(1 as unknown as string, "v")).toThrow(TypeError);
    expect(() => set(1 as unknown as string, "v")).toThrow("name must be a string");
  });

  it("throws if value not string", () => {
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    vi.stubGlobal("document", doc);
    expect(() => set("n", 2 as unknown as string)).toThrow(TypeError);
    expect(() => set("n", 2 as unknown as string)).toThrow("value must be a string");
  });
});
