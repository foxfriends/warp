import { never } from "../constructor/never.mjs";

export function preface(loading) {
  return async function* (source) {
    let nextloading = loading.next();
    let nextsource = source.next();
    for (;;) {
      const result = await Promise.race([
        nextloading.then((l) => ({ l })),
        nextsource.then((r) => ({ r })),
      ]);

      if ("l" in result) {
        if (result.l.done) {
          nextloading = never();
        } else {
          nextloading = loading.next();
          yield result.l.value;
        }
      } else {
        yield result.r.value;
        break;
      }
    }
    yield* source;
  };
}
