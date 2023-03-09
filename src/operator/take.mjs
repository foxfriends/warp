export function take(n) {
  return async function* (iter) {
    let toTake = n;
    for await (const value of iter) {
      if (toTake <= 0) {
        return;
      }
      yield value;
      toTake -= 1;
    }
  };
}
