import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as detectCookieStore from "../detectCookieStore.js";
import * as adapter from "../cookieStoreAdapter.js";
import { getAsync, setAsync, removeAsync } from "../asyncApi.js";
import * as coreGet from "../../core/get.js";
import * as coreSet from "../../core/set.js";
import * as coreRemove from "../../core/remove.js";

describe("asyncApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("when cookieStore missing, getAsync falls back to sync get() result", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(false);
    vi.spyOn(coreGet, "get").mockReturnValue("fallback-value");
    const result = await getAsync("foo");
    expect(result).toBe("fallback-value");
    expect(coreGet.get).toHaveBeenCalledWith("foo");
  });

  it("when cookieStore missing, setAsync calls sync set and resolves", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(false);
    const setSpy = vi.spyOn(coreSet, "set").mockImplementation(() => {});
    await setAsync("n", "v", { path: "/" });
    expect(setSpy).toHaveBeenCalledWith("n", "v", { path: "/" });
  });

  it("when cookieStore missing, removeAsync calls sync remove and resolves", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(false);
    const removeSpy = vi.spyOn(coreRemove, "remove").mockImplementation(() => {});
    await removeAsync("n", { path: "/" });
    expect(removeSpy).toHaveBeenCalledWith("n", { path: "/" });
  });

  it("when cookieStore present, getAsync uses adapter.getCookie", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(true);
    vi.spyOn(adapter, "getCookie").mockResolvedValue("adapter-value");
    const result = await getAsync("foo");
    expect(result).toBe("adapter-value");
    expect(adapter.getCookie).toHaveBeenCalledWith("foo");
  });

  it("when cookieStore present, setAsync uses adapter.setCookie", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(true);
    vi.spyOn(adapter, "setCookie").mockResolvedValue(undefined);
    await setAsync("n", "v", { path: "/" });
    expect(adapter.setCookie).toHaveBeenCalledWith("n", "v", { path: "/" });
  });

  it("when cookieStore present, removeAsync uses adapter.deleteCookie", async () => {
    vi.spyOn(detectCookieStore, "hasCookieStore").mockReturnValue(true);
    vi.spyOn(adapter, "deleteCookie").mockResolvedValue(undefined);
    await removeAsync("n", { path: "/" });
    expect(adapter.deleteCookie).toHaveBeenCalledWith("n", { path: "/" });
  });
});
