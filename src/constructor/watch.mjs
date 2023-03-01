import { warp } from "./warp.mjs";

export function watch(iterable) {
  return warp(iterable[Symbol.asyncIterator]());
}
