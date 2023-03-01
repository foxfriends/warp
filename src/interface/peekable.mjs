const NIL = Symbol("NIL");

export function peekable(iter) {
  let peeked = NIL;

  function peek() {
    if (peeked === NIL) {
      peeked = iter.next();
    }
    return peeked;
  }

  function next() {
    const result = peeked === NIL ? iter.next() : peeked;
    peeked = NIL;
    return result;
  }

  return {
    peek,
    next,
  };
}
