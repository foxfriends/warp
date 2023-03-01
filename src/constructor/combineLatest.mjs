import { never } from "./never.mjs";
import { warp } from "./warp.mjs";

async function* _combineLatest(sources) {
  const iters = sources.map(warp);
  const state = await Promise.all(
    iters.map((iter) => iter.next().then(({ value }) => value))
  );
  yield state.slice();
  const nexts = iters.map(async (iter, index) => ({
    index,
    next: await iter.next(),
  }));
  for (;;) {
    const { index, next } = await Promise.race(nexts);
    if (next.done) {
      nexts[index] = never();
    } else {
      nexts[index] = iters[index].next().then((next) => ({ index, next }));
      state[index] = next.value;
      yield state.slice();
    }
  }
}

export function combineLatest(sources) {
  return warp(_combineLatest(sources));
}
