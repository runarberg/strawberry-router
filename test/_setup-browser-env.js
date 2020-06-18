/* globals globalThis */

import jsdom from "jsdom";

const { window } = new jsdom.JSDOM();

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
