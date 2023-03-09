import { watch } from "../constructor/watch.mjs";
import { combineLatest } from "../constructor/combineLatest.mjs";
import { on } from "./on.mjs";
import { attr } from "./attr.mjs";
import { renderChildren } from "./renderChildren.mjs";

export async function* bindValue(store) {
  const getter = on("change", (event) => store.set(event.target.value));
  const setter = attr("value", watch(store));

  for await (const state of combineLatest([getter, setter])) {
    yield renderChildren(state);
  }
}
