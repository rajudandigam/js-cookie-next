import { describe, it, expect } from "vitest";
import { parse } from "../parse.js";

describe("parse", () => {
  it("empty string → {}", () => {
    expect(parse("")).toEqual({});
  });

  it("non-string input → {}", () => {
    expect(parse(null as unknown as string)).toEqual({});
    expect(parse(123 as unknown as string)).toEqual({});
  });

  it("single cookie", () => {
    expect(parse("foo=bar")).toEqual({ foo: "bar" });
  });

  it("multiple cookies", () => {
    expect(parse("a=1; b=2; c=3")).toEqual({ a: "1", b: "2", c: "3" });
  });

  it("whitespace around segments", () => {
    expect(parse("  foo = bar  ;  baz = qux  ")).toEqual({
      foo: "bar",
      baz: "qux",
    });
  });

  it("duplicate keys (last wins)", () => {
    expect(parse("a=1; a=2; a=3")).toEqual({ a: "3" });
  });

  it("no \"=\" segment ignored", () => {
    expect(parse("a=1; invalid; b=2")).toEqual({ a: "1", b: "2" });
  });

  it("malformed percent encoding does not throw", () => {
    expect(parse("a=1; b=%GG; c=3")).toEqual({ a: "1", c: "3" });
  });

  it("encoded name and value decode correctly", () => {
    expect(parse("a%20b=x%3Dy")).toEqual({ "a b": "x=y" });
  });

  it("value with \"=\" inside (split only on first \"=\")", () => {
    expect(parse("key=a=b=c")).toEqual({ key: "a=b=c" });
  });
});
