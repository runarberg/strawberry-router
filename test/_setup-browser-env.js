/* globals globalThis */

import jsdom from "jsdom";

const { window } = new jsdom.JSDOM("", {
  url: "http://example.test",
  pretendToBeVisual: true,
});

globalThis.window = window;
globalThis.document = window.document;
globalThis.CustomEvent = window.CustomEvent;
globalThis.DocumentFragment = window.DocumentFragment;
globalThis.Event = window.Event;
globalThis.HTMLElement = window.HTMLElement;
