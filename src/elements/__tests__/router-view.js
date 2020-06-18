import test from "ava";

import HTMLRouterViewElement from "../router-view.js";

test.beforeEach(() => {
  window.customElements.define("router-view", HTMLRouterViewElement);
});

test("registers element", (t) => {
  const el = document.createElement("router-view");

  t.is(el instanceof HTMLRouterViewElement, true);
});
