import { HTMLRouterViewElement, NOT_FOUND, navigate } from "../../src/index.js";

/**
 * @typedef {{ data: { [string]: string } }} RouteData
 */

/**
 * A helper render function that grabs a `<template>` from the
 * document tree and returns a cloned fragment. All candidate
 * templates must have a prepended `template:` for an id.
 *
 * @param {string} id - The `id` of the template element (minus the
 *   prepended `template:`)
 * @param {(fragment: DocumentFragment, data: RouteData) => void} init
 *   - An optional initialization function to run on the fragment
 *   *after* it has been cloned. Use this to attach listeners, set
 *   properties, etc.
 * @returns {(data: RouteData) => DocumentFragment}
 */
function fromTemplate(id, init) {
  return (routeData) => {
    const template = document.getElementById(`template:${id}`);
    const fragment =
      !template || !(template instanceof HTMLTemplateElement)
        ? new DocumentFragment()
        : template.content.cloneNode(true);

    if (init && template) {
      init(fragment, routeData);
    }

    return fragment;
  };
}

function main() {
  const routerView = document.querySelector(
    "router-view[root='/examples/demo/']",
  );

  if (!(routerView instanceof HTMLRouterViewElement)) {
    return;
  }

  routerView.routes = new Map([
    ["/", { render: fromTemplate("app/home") }],
    ["/foo", { render: fromTemplate("app/foo") }],
    ["/bar", { render: fromTemplate("app/bar") }],
    [
      "/hello/:word",
      {
        render: fromTemplate("app/hello", (fragment, { params: { word } }) => {
          fragment.querySelector(
            "[data-interpolate='word']",
          ).textContent = word;
        }),
      },
    ],
    [
      "/nested/*",
      {
        render: fromTemplate("app/nested", (fragment) => {
          const nestedRouterView = fragment.querySelector(
            "router-view[root='/examples/demo/nested/']",
          );

          nestedRouterView.routes = new Map([
            ["/", { render: fromTemplate("app/nested/home") }],
            ["/foo", { render: fromTemplate("app/nested/foo") }],
            ["/bar", { render: fromTemplate("app/nested/bar") }],
            [NOT_FOUND, { render: fromTemplate("app/not-found") }],
          ]);

          for (const anchor of fragment.querySelectorAll("nav a")) {
            anchor.addEventListener("click", (event) => {
              event.preventDefault();

              navigate(new URL(anchor.href));
            });
          }
        }),
      },
    ],
    [NOT_FOUND, { render: fromTemplate("app/not-found") }],
  ]);

  for (const anchor of document.querySelectorAll("body > nav a")) {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();

      navigate(new URL(anchor.href));
    });
  }
}

document.addEventListener("DOMContentLoaded", main);
