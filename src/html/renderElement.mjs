import { combineLatest } from "../constructor/combineLatest.mjs";
import { renderChildren } from "./renderChildren.mjs";

export async function* renderElement(elementName, children) {
  const element = document.createElement(elementName);
  for await (const state of combineLatest(children)) {
    const render = renderChildren(state);
    yield (parent) => {
      const unrender = render(element);
      parent.appendChild(element);
      return () => {
        parent.removeChild(element);
        unrender();
      };
    };
  }
}
