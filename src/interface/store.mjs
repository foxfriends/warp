import { signal } from "./signal.mjs";
import { only } from "../constructor/only.mjs";
import { watch } from "../constructor/watch.mjs";
import { chain } from "../operator/chain.mjs";

export function store(value) {
  const waker = signal();

  function set(updated) {
    value = updated;
    waker.wake(value);
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe() {
    return only(value).pipe(chain(watch(waker)));
  }

  const store = {
    set,
    update,
    [Symbol.asyncIterator]: subscribe,
  };
  store.pipe = (...fns) => fns.reduce((store, fn) => fn(store), store);
  return store;
}
