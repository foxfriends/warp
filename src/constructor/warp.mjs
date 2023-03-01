import { only } from "./only.mjs";

const WARPED = Symbol("WARPED");

export function warp(iter) {
  if (typeof iter === "object" && WARPED in iter) {
    // To prevent repeatedly warping an already warped object
    return iter;
  }

  if (typeof iter === "object" && Symbol.asyncIterator in iter) {
    function pipe(...fns) {
      return fns.reduce((iter, fn) => warp(fn(iter)), warp(iter));
    }

    return {
      [WARPED]: true,
      pipe, // warped really just means add `pipe` to an iterator
      next: iter.next.bind(iter),
      throw: iter.throw.bind(iter),
      return: iter.return.bind(iter),
      [Symbol.asyncIterator]: iter[Symbol.asyncIterator].bind(iter),
    };
  }

  return warp(only(iter));
}
