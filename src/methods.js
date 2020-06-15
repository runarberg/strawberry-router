/**
 * Navigate using the router. Will update each `<router-view>` in the
 * document with the new URL.
 *
 * @param { URL } url - The URL in which to route to
 * @fires Window#navigate
 */
export function navigate(url) {
  /**
   * Navigate event. Updates all `<router-view>` elements in the document.
   *
   * @event Window#navigate
   * @type CustomEvent<URL>
   */
  const event = new CustomEvent("navigate", { detail: url });

  window.dispatchEvent(event);
}
