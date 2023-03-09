import { watch } from "../constructor/watch.mjs";

export function lens(get, set) {
  return (store) => {
    const newStore = {
      set: (val) => store.update((state) => set(val, state)),
      update: (fn) => store.update((state) => set(fn(get(state)), state)),
      async *[Symbol.asyncIterator]() {
        for await (const value of watch(store)) {
          yield get(value);
        }
      },
    };
    newStore.pipe = (...fns) => fns.reduce((store, fn) => fn(store), newStore);
    return newStore;
  };
}
