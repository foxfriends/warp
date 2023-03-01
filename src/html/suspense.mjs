import { warp } from "../constructor/warp.mjs";
import { flatten } from "../operator/flatten.mjs";
import { preface } from "../operator/preface.mjs";

export function suspense(promise, loading, ready, failed) {
  return warp(promise.then(ready, failed)).pipe(flatten(), preface(loading));
}
