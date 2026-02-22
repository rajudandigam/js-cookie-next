import { describe, it, expect, vi, afterEach } from "vitest";
import type { CookieOptions } from "../../types.js";
import {
  getCookie,
  getAllCookies,
  setCookie,
  deleteCookie,
} from "../cookieStoreAdapter.js";

describe("cookieStoreAdapter", () => {
  let documentDescriptor: PropertyDescriptor | undefined;

  afterEach(() => {
    vi.restoreAllMocks();
    if (documentDescriptor !== undefined) {
      Object.defineProperty(globalThis, "document", documentDescriptor);
    }
    delete (globalThis as unknown as { cookieStore?: unknown }).cookieStore;
  });

  it("getCookie returns undefined when cookieStore missing", async () => {
    documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    vi.stubGlobal("cookieStore", undefined);
    expect(await getCookie("foo")).toBeUndefined();
  });

  it("getCookie returns value when cookieStore present", async () => {
    const mockStore = {
      get: vi.fn().mockResolvedValue({ name: "foo", value: "bar" }),
      getAll: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("cookieStore", mockStore);
    expect(await getCookie("foo")).toBe("bar");
    expect(mockStore.get).toHaveBeenCalledWith("foo");
  });

  it("getAllCookies returns {} when missing", async () => {
    vi.stubGlobal("cookieStore", undefined);
    expect(await getAllCookies()).toEqual({});
  });

  it("getAllCookies returns map and last duplicate wins", async () => {
    const mockStore = {
      get: vi.fn().mockResolvedValue(null),
      getAll: vi.fn().mockResolvedValue([
        { name: "a", value: "1" },
        { name: "a", value: "2" },
        { name: "b", value: "3" },
      ]),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("cookieStore", mockStore);
    expect(await getAllCookies()).toEqual({ a: "2", b: "3" });
  });

  it("setCookie maps expires:number days to Date (mock Date.now) and calls store.set with mapped object", async () => {
    const mockStore = {
      get: vi.fn().mockResolvedValue(null),
      getAll: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("cookieStore", mockStore);
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-01-15T12:00:00.000Z").getTime());
    await setCookie("n", "v", { expires: 1 });
    expect(mockStore.set).toHaveBeenCalledTimes(1);
    const setArg = mockStore.set.mock.calls[0][0];
    expect(setArg.name).toBe("n");
    expect(setArg.value).toBe("v");
    expect(setArg.expires).toBeInstanceOf(Date);
    expect((setArg.expires as Date).toISOString()).toBe("2026-01-16T12:00:00.000Z");
    vi.restoreAllMocks();
  });

  it("setCookie ignores unknown options (e.g. priority/mode not passed)", async () => {
    const mockStore = {
      get: vi.fn().mockResolvedValue(null),
      getAll: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("cookieStore", mockStore);
    await setCookie("n", "v", {
      priority: "high",
      mode: "partitioned",
    } as CookieOptions);
    const setArg = mockStore.set.mock.calls[0][0];
    expect(setArg.priority).toBeUndefined();
    expect(setArg.mode).toBeUndefined();
    expect(setArg.name).toBe("n");
    expect(setArg.value).toBe("v");
  });

  it("deleteCookie calls store.delete", async () => {
    const mockStore = {
      get: vi.fn().mockResolvedValue(null),
      getAll: vi.fn().mockResolvedValue([]),
      set: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal("cookieStore", mockStore);
    await deleteCookie("foo", { path: "/" });
    expect(mockStore.delete).toHaveBeenCalledWith({ name: "foo", path: "/" });
  });
});
