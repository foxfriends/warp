import { deferred } from "./deferred.mjs";

export function signal() {
  let promise = deferred();

  function wait() {
    return promise;
  }

  function wake(value) {
    const waker = promise;
    promise = deferred();
    waker.resolve(value);
  }

  async function* subscribe() {
    for (;;) {
      yield wait();
    }
  }

  return { wait, wake, [Symbol.asyncIterator]: subscribe };
}
