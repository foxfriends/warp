import { warp } from "./warp.mjs";

export function watch(iterable) {
  if (iterable?.[Symbol.asyncIterator]) {
    return warp(iterable[Symbol.asyncIterator]());
  } else {
    return warp(iterable);
  }
}
