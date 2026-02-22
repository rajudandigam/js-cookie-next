import { describe, it, expect } from "vitest";
import * as lib from "../index.js";

describe("public API surface", () => {
  it("exports get as function", () => {
    expect(typeof lib.get).toBe("function");
  });

  it("exports set as function", () => {
    expect(typeof lib.set).toBe("function");
  });

  it("exports remove as function", () => {
    expect(typeof lib.remove).toBe("function");
  });

  it("exports getAsync as function", () => {
    expect(typeof lib.getAsync).toBe("function");
  });

  it("exports setAsync as function", () => {
    expect(typeof lib.setAsync).toBe("function");
  });

  it("exports removeAsync as function", () => {
    expect(typeof lib.removeAsync).toBe("function");
  });

  it("exports default object with same methods", () => {
    expect(lib.default).toBeDefined();
    expect(lib.default.get).toBe(lib.get);
    expect(lib.default.set).toBe(lib.set);
    expect(lib.default.remove).toBe(lib.remove);
    expect(lib.default.getAsync).toBe(lib.getAsync);
    expect(lib.default.setAsync).toBe(lib.setAsync);
    expect(lib.default.removeAsync).toBe(lib.removeAsync);
  });
});
