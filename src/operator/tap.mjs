export function tap(fn) {
  return async function* (iter) {
    for await (const value of iter) {
      fn(value);
      yield value;
    }
  };
}
