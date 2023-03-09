export function count() {
  return async function* (iter) {
    yield 0;

    let n = 0;
    for await (const signal of iter) {
      n += 1;
      yield n;
    }
  };
}
