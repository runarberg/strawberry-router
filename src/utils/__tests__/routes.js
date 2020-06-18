import test from "ava";

import { MISSING_ROUTE, NOT_FOUND } from "../globals.js";
import { findRoute } from "../routes.js";

/**
 * @param {string} text
 * @returns {() => DocumentFragment}
 */
function renderText(text) {
  return () => {
    const fragment = new DocumentFragment();
    const p = document.createElement("p");
    p.textContent = text;

    return fragment;
  };
}

const host = "https://example.test";
const renderNotFound = renderText("Not Found");
const renderHome = renderText("Home");
const renderFoo = renderText("Foo");
const renderHello = renderText("hello");

/** @type {import("../routes.js").RouteMap} */
const routes = new Map([
  ["", { render: renderHome }],
  ["foo", { render: renderFoo }],
  ["hello/:word", { render: renderHello }],
]);

routes.set(NOT_FOUND, { render: renderNotFound });

test("findRoute - simple match", (t) => {
  const url = new URL("/foo", host);

  t.deepEqual(findRoute("/", url, routes), {
    config: { render: renderFoo },
    route: { params: {}, url },
  });
});

test("findRoute -simple match with trailing slash", (t) => {
  const url = new URL("/foo/", host);

  t.deepEqual(findRoute("/", url, routes), {
    config: { render: renderFoo },
    route: { params: {}, url },
  });
});

test("findRoute - simple match with root", (t) => {
  const url = new URL("/with/root/foo", host);

  t.deepEqual(findRoute("/with/root/", url, routes), {
    config: { render: renderFoo },
    route: { params: {}, url },
  });

  t.deepEqual(findRoute("/with/root", url, routes), {
    config: { render: renderFoo },
    route: { params: {}, url },
  });
});

test("findRoute - empty supbath", (t) => {
  const url = new URL(host);

  t.deepEqual(findRoute("/", url, routes), {
    config: { render: renderHome },
    route: { params: {}, url },
  });
});

test("findRoute - empty supbath with root", (t) => {
  const url = new URL("some/root", host);

  t.deepEqual(findRoute("/some/root/", url, routes), {
    config: { render: renderHome },
    route: { params: {}, url },
  });
});

test("findRoute - params", (t) => {
  const url = new URL("/hello/world", host);

  t.deepEqual(findRoute("/", url, routes), {
    config: { render: renderHello },
    route: { params: { word: "world" }, url },
  });
});

test("findRoute - root mismatch", (t) => {
  const url = new URL("/baz", host);

  t.deepEqual(findRoute("/not/root", url, routes), {
    config: MISSING_ROUTE,
    route: { params: {}, url },
  });
});

test("findRoute - not found", (t) => {
  const url = new URL("/not-found", host);

  t.deepEqual(findRoute("/", url, routes), {
    config: { render: renderNotFound },
    route: { params: {}, url },
  });
});

test("findRoute - not found and missing", (t) => {
  const url = new URL("/not-found", host);

  t.deepEqual(findRoute("/", url, new Map()), {
    config: MISSING_ROUTE,
    route: { params: {}, url },
  });
});
