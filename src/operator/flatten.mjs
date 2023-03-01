import { warp } from "../constructor/warp.mjs";

export function flatten() {
  return async function* (iters) {
    for await (const iter of iters) {
      for await (const val of warp(iter)) {
        yield val;
      }
    }
  };
}
