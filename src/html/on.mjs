import { combineLatest } from "../constructor/combineLatest.mjs";

export async function* on($event, $handler) {
  for await (const [event, handler] of combineLatest([$event, $handler])) {
    yield (element) => {
      element.addEventListener(event, handler);
      return () => element.removeEventListener(event, handler);
    };
  }
}
