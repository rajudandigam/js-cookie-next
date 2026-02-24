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
});
