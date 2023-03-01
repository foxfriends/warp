import { store, watch } from "./warp/index.mjs";
import { render, div, button, text, on } from "./warp/html/index.mjs";

function App() {
  const clicks = store(0);

  return div(
    div(text("Clicks: "), text(watch(clicks))),
    button(
      text("Click this"),
      on("click", () => clicks.update((n) => n + 1))
    )
  );
}

await render(document.querySelector("body"), App());
