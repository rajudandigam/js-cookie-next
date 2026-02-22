import { describe, it, expect, vi, afterEach } from "vitest";
import { remove } from "../remove.js";

describe("remove", () => {
  let cookieValue: string;
  let documentDescriptor: PropertyDescriptor | undefined;

  afterEach(() => {
    if (documentDescriptor) {
      Object.defineProperty(globalThis, "document", documentDescriptor);
    }
  });

  it("SSR no-op", () => {
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("document", undefined);
    expect(() => remove("a")).not.toThrow();
  });

  it("writes cookie with Expires=Thu, 01 Jan 1970 ...", () => {
    cookieValue = "";
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("document", doc);
    remove("foo");
    expect(cookieValue).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    expect(cookieValue).toMatch(/^foo=;/);
  });

  it("preserves path if provided", () => {
    cookieValue = "";
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("document", doc);
    remove("foo", { path: "/admin" });
    expect(cookieValue).toContain("Path=/admin");
    expect(cookieValue).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("preserves domain if provided", () => {
    cookieValue = "";
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("document", doc);
    remove("foo", { domain: ".example.com" });
    expect(cookieValue).toContain("Domain=.example.com");
    expect(cookieValue).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("throws if name not string", () => {
    cookieValue = "";
    const doc = {
      get cookie() {
        return cookieValue;
      },
      set cookie(v: string) {
        cookieValue = v;
      },
    };
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("document", doc);
    expect(() => remove(1 as unknown as string)).toThrow(TypeError);
    expect(() => remove(1 as unknown as string)).toThrow("name must be a string");
  });
});
