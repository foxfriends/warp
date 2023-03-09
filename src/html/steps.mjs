import { warp } from "../constructor/warp.mjs";
import { store } from "../interface/store.mjs";
import { map } from "../operator/map.mjs";
import { switchLatest } from "../operator/switchLatest.mjs";
import { watch } from "../constructor/watch.mjs";

export function steps(steps) {
  const currentStep = store(0);

  function next() {
    currentStep.update((n) => n + 1);
  }

  function back() {
    currentStep.update((n) => n - 1);
  }

  return watch(currentStep).pipe(
    map((n) => warp(steps[n])),
    switchLatest(),
    map((renderer) => renderer({ next, back })),
    switchLatest()
  );
}
