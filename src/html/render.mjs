export async function render(target, app) {
  let { value: render, done } = await app.next();
  while (!done) {
    const unrender = render(target);
    ({ value: render, done } = await app.next());
    unrender();
  }
}
