import test from "ava";
import sinon from "sinon";

import HTMLRouterViewElement from "../router-view.js";

test.before(() => {
  window.customElements.define("router-view", HTMLRouterViewElement);
});

test("registers element", (t) => {
  const el = document.createElement("router-view");

  t.is(el instanceof HTMLRouterViewElement, true);
});

test("calls render on connect", (t) => {
  const el = document.createElement("router-view");

  t.teardown(() => {
    el.remove();
  });

  if (!(el instanceof HTMLRouterViewElement)) {
    t.fail("el is not `router-view`");
    return;
  }

  const spy = sinon.spy(el, "render");

  t.is(spy.called, false);
  document.body.appendChild(el);

  t.is(spy.called, true);
});

test("renders on `navigate`", (t) => {
  const el = document.createElement("router-view");

  t.teardown(() => {
    el.remove();
  });

  if (!(el instanceof HTMLRouterViewElement)) {
    t.fail("el is not `router-view`");
    return;
  }

  const spy = sinon.spy(el, "render");
  document.body.appendChild(el);

  window.dispatchEvent(
    new CustomEvent("navigate", {
      detail: new URL("/foo", window.location.origin),
    }),
  );

  t.is(spy.callCount, 2);
});

test("stops rendering on `navigate` after disconnect", (t) => {
  const el = document.createElement("router-view");

  t.teardown(() => {
    el.remove();
  });

  if (!(el instanceof HTMLRouterViewElement)) {
    t.fail("el is not `router-view`");
    return;
  }

  const spy = sinon.spy(el, "render");
  document.body.appendChild(el);

  window.dispatchEvent(
    new CustomEvent("navigate", {
      detail: new URL("/foo", window.location.origin),
    }),
  );

  el.remove();

  window.dispatchEvent(
    new CustomEvent("navigate", {
      detail: new URL("/foo", window.location.origin),
    }),
  );

  t.is(spy.callCount, 2);
});

test("renders on `popstate`", (t) => {
  const el = document.createElement("router-view");

  t.teardown(() => {
    el.remove();
  });

  if (!(el instanceof HTMLRouterViewElement)) {
    t.fail("el is not `router-view`");
    return;
  }

  const spy = sinon.spy(el, "render");
  document.body.appendChild(el);

  window.dispatchEvent(new Event("popstate"));

  t.is(spy.callCount, 2);
});

test("stops rendering on `popstate` after disconnect", (t) => {
  const el = document.createElement("router-view");

  t.teardown(() => {
    el.remove();
  });

  if (!(el instanceof HTMLRouterViewElement)) {
    t.fail("el is not `router-view`");
    return;
  }

  const spy = sinon.spy(el, "render");
  document.body.appendChild(el);

  window.dispatchEvent(new Event("popstate"));

  el.remove();

  window.dispatchEvent(new Event("popstate"));

  t.is(spy.callCount, 2);
});
