import { signal } from "../interface/signal.mjs";
import { watch } from "../constructor/watch.mjs";

export function interval(timeout) {
  const notify = signal();

  let watchers = 0;
  let interval;
  function start() {
    watchers += 1;
    if (!interval) {
      interval = window.setInterval(() => notify.wake(), timeout);
    }
  }

  function stop() {
    watchers -= 1;
    if (!watchers) {
      window.clearInterval(interval);
      interval = null;
    }
  }

  return {
    async *[Symbol.asyncIterator]() {
      try {
        start();
        yield* watch(notify);
      } finally {
        stop();
      }
    },
  };
}
