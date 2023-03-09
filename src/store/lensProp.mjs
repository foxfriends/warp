import { lens } from "./lens.mjs";

export function lensProp(key) {
  return lens(
    (state) => state[key],
    (value, state) => {
      console.log(value, key, state);
      return { ...state, [key]: value };
    }
  );
}
