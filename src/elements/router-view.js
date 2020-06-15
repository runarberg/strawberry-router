import { findRoute } from "../utils/routes.js";

/**
 * @typedef {object} PrivateFields
 * @prop {string} root
 * @prop {?number} renderingId
 */

/**
 * @type {WeakMap<HTMLRouterViewElement, PrivateFields>}
 */
const PRIVATE_FIELDS = new WeakMap();

/**
 * The `<router-view>` element. A basic router view element that calls
 * a render function on load, on popstate, or when a custom navigate
 * event is fired. The render function should return a document
 * fragment that gets rendered inside the shadow root of this
 * element. The render function is picked from a map of `Routes`. If
 * none is matched an empty fragment is rendered instead.
 *
 * @attr {string="/"} root - The root will be prepended to each
 *       route’s pathname
 * @prop {import("../utils/routes.js").RouteMap} routes - The route
 *       map that maps a subpath to a render function
 */
export default class HTMLRouterViewElement extends HTMLElement {
  constructor() {
    super();

    this.routes = new Map();

    PRIVATE_FIELDS.set(this, {
      root: "/",
      renderingId: null,
    });

    this.attachShadow({ mode: "open" });

    /**
     * @listens Window#navigate
     */
    window.addEventListener("navigate", (event) => {
      if (event instanceof CustomEvent && event.detail instanceof URL) {
        this.render(event.detail.pathname);
      }
    });

    /**
     * @listens Window#popstate
     */
    window.addEventListener("popstate", () => {
      this.render(window.location.pathname);
    });
  }

  connectedCallback() {
    this.render(window.location.pathname);
  }

  /**
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ["root"];
  }

  /**
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    const privateFields = PRIVATE_FIELDS.get(this);

    if (!privateFields) {
      return;
    }

    if (oldValue === newValue) {
      return;
    }

    if (name === "root") {
      privateFields.root = newValue;
    }
  }

  /**
   * Get the root pathname of this router view. Reflects the `root` attribute.
   * @type {string}
   */
  get root() {
    return PRIVATE_FIELDS.get(this)?.root ?? "";
  }

  set root(value) {
    const privateFields = PRIVATE_FIELDS.get(this);

    if (!privateFields) {
      return;
    }

    privateFields.root = value;
    this.setAttribute("root", value);
  }

  /**
   * Render this router view with a specific pathname
   * @param {string} pathname
   */
  async render(pathname) {
    const privateFields = PRIVATE_FIELDS.get(this);

    if (!privateFields) {
      return;
    }

    if (privateFields.renderingId) {
      window.cancelAnimationFrame(privateFields.renderingId);
    }

    await new Promise((resolve) => {
      privateFields.renderingId = window.requestAnimationFrame(() => resolve());
    });

    if (!this.shadowRoot) {
      return;
    }

    const route = findRoute(this.root, pathname, this.routes);
    const fragment = route.render();

    while (this.shadowRoot.firstChild) {
      this.shadowRoot.firstChild.remove();
    }

    this.shadowRoot.appendChild(fragment);
  }
}

window.customElements.define("router-view", HTMLRouterViewElement);
