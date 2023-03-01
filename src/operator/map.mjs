export function map(fn) {
  return async function* (iter) {
    for await (const value of iter) {
      yield fn(value);
    }
  };
}
