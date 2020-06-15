import { NOT_FOUND, navigate } from "../../src/index.js";

/**
 * A helper render function that grabs a `<template>` from the
 * document tree and returns a cloned fragment. All candidate
 * templates must have a prepended `template:` for an id.
 *
 * @param {string} id - The `id` of the template element (minus the
 *        prepended `template:`)
 * @param {(DocumentFragment) => void} init - An optional
 *        initialization function to run on the fragment *after* it
 *        has been cloned. Use this to attach listeners, set
 *        properties, etc.
 * @return {DocumentFragment}
 */
function fromTemplate(id, init) {
  return () => {
    const template = document.getElementById(`template:${id}`);
    const fragment =
      !template || !(template instanceof HTMLTemplateElement)
        ? new DocumentFragment()
        : template.content.cloneNode(true);

    if (init && template) {
      init(fragment);
    }

    return fragment;
  };
}

function main() {
  const routerView = document.querySelector("router-view");

  routerView.routes = new Map([
    ["/", { render: fromTemplate("app/home") }],
    ["/foo", { render: fromTemplate("app/foo") }],
    ["/bar", { render: fromTemplate("app/bar") }],
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
