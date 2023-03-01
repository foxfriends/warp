import { warp } from "./warp.mjs";

async function* _always(value) {
  for (;;) {
    yield value;
  }
}

export function always(value) {
  return warp(_always(value));
}
