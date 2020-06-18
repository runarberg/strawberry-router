import HTMLRouterViewElement from "./elements/router-view.js";
export { NOT_FOUND } from "./utils/globals.js";
export { navigate } from "./methods.js";

window.addEventListener("navigate", (event) => {
  if (event instanceof CustomEvent && event.detail instanceof URL) {
    window.history.pushState(null, "", event.detail.href);
  }
});

window.customElements.define("router-view", HTMLRouterViewElement);

export { HTMLRouterViewElement };
