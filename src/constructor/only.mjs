import { warp } from "./warp.mjs";

async function* _only(value) {
  yield value;
}

export function only(value) {
  return warp(_only(value));
}
