import { never } from "../constructor/never.mjs";

const NIL = Symbol("NIL");

export function withLatestFrom(values) {
  return async function* (iter) {
    let value = NIL;
    let nextSignal = iter.next();
    let nextValue = values.next();
    for (;;) {
      const result = await Promise.race([
        nextSignal.map((l) => ({ l })),
        nextValue.map((r) => ({ r })),
      ]);

      if (result.l) {
        if (value !== NIL) {
          yield value;
        }
        if (result.l.done) {
          break;
        }
        nextSignal = iter.next();
      } else {
        value = result.l.value;
        if (result.l.done) {
          nextValue = never();
        } else {
          nextValue = values.next();
        }
      }
    }
  };
}
