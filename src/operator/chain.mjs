import { warp } from "../constructor/warp.mjs";

export function chain(iter) {
  return async function* (first) {
    yield* first;
    yield* warp(iter);
  };
}
