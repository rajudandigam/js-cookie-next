import type { CookieOptions } from "./types.js";
import { get } from "./core/get.js";
import { set } from "./core/set.js";
import { remove } from "./core/remove.js";
import { getAsync, setAsync, removeAsync } from "./async/asyncApi.js";

export { get, set, remove, getAsync, setAsync, removeAsync };
export type { CookieOptions };
