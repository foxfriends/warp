import { combineLatest } from "../constructor/combineLatest.mjs";

export async function* attr($name, $value) {
  for await (const [name, value] of combineLatest([$name, $value])) {
    yield (element) => {
      element.setAttribute(name, value);
      return () => element.removeAttribute(name);
    };
  }
}
