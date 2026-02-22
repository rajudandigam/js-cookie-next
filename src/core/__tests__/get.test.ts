import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "../get.js";

describe("get", () => {
  const docCookieDesc = Object.getOwnPropertyDescriptor(globalThis, "document");

  afterEach(() => {
    if (docCookieDesc) {
      Object.defineProperty(globalThis, "document", docCookieDesc);
    } else {
      delete (globalThis as unknown as { document?: unknown }).document;
    }
  });

  it("no document (SSR) returns {} for get()", () => {
    vi.stubGlobal("document", undefined);
    expect(get()).toEqual({});
  });

  it("no document (SSR) returns undefined for get(name)", () => {
    vi.stubGlobal("document", undefined);
    expect(get("foo")).toBeUndefined();
  });

  it("empty cookie string", () => {
    vi.stubGlobal("document", { cookie: "" });
    expect(get()).toEqual({});
    expect(get("any")).toBeUndefined();
  });

  it("single cookie", () => {
    vi.stubGlobal("document", { cookie: "foo=bar" });
    expect(get()).toEqual({ foo: "bar" });
    expect(get("foo")).toBe("bar");
  });

  it("multiple cookies", () => {
    vi.stubGlobal("document", { cookie: "a=1; b=2; c=3" });
    expect(get()).toEqual({ a: "1", b: "2", c: "3" });
    expect(get("a")).toBe("1");
    expect(get("b")).toBe("2");
    expect(get("c")).toBe("3");
  });

  it("get(name) returns correct value", () => {
    vi.stubGlobal("document", { cookie: "theme=dark" });
    expect(get("theme")).toBe("dark");
  });

  it("get(name) returns undefined if not found", () => {
    vi.stubGlobal("document", { cookie: "a=1" });
    expect(get("b")).toBeUndefined();
    expect(get("")).toBeUndefined();
  });

  it("get() returns object map", () => {
    vi.stubGlobal("document", { cookie: "x=1; y=2" });
    const out = get();
    expect(out).toEqual({ x: "1", y: "2" });
    expect(get()).not.toBe(get());
  });

  it("encoded cookies decode correctly", () => {
    vi.stubGlobal("document", { cookie: "a%20b=x%3Dy" });
    expect(get()).toEqual({ "a b": "x=y" });
    expect(get("a b")).toBe("x=y");
  });
});
