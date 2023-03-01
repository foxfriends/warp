import { warp } from "../constructor/warp.mjs";
import { never } from "../constructor/never.mjs";

export async function* switchLatest(iters) {
  let sourceDone = false;
  const { value, done } = await iters.next();
  if (done) {
    return;
  }
  let iter = warp(value);
  let nextIter = iters.next();
  let nextVal = iter.next();
  for (;;) {
    const winner = await Promise.race([
      nextIter.then((left) => ({ left })),
      nextVal.then((right) => ({ right })),
    ]);
    if (winner.left) {
      const { value, done } = winner.left;
      iter = warp(value);
      nextVal = iter.next();
      if (done) {
        nextIter = never();
        sourceDone = true;
      } else {
        nextIter = iters.next();
      }
    } else if (winner.right) {
      const { value, done } = winner.right;
      if (done) {
        if (sourceDone) {
          break;
        }
        nextVal = never();
      } else {
        nextVal = iter.next();
        yield value;
      }
    }
  }
}
