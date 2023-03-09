import { warp } from "../constructor/warp.mjs";
import { watch } from "../constructor/watch.mjs";
import { combineLatest } from "../constructor/combineLatest.mjs";
import { renderElement } from "./renderElement.mjs";

export function div(...children) {
  return renderElement("div", children);
}

export function button(...children) {
  return renderElement("button", children);
}

export function input(...children) {
  return renderElement("input", children);
}

export function p(...children) {
  return renderElement("p", children);
}

export function span(...children) {
  return renderElement("span", children);
}

export async function* text(strings, ...content) {
  const node = document.createTextNode("");
  for await (const children of combineLatest(content.map(watch))) {
    yield (parent) => {
      node.textContent = strings.reduce(
        (text, string, i) => `${text}${children[i - 1]}${string}`
      );
      parent.appendChild(node);
      return () => parent.removeChild(node);
    };
  }
}

export async function* on($event, $handler) {
  for await (const [event, handler] of combineLatest([$event, $handler])) {
    yield (element) => {
      element.addEventListener(event, handler);
      return () => element.removeEventListener(event, handler);
    };
  }
}
