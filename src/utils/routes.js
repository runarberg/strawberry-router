import { MISSING_ROUTE, NOT_FOUND } from "./globals.js";

/**
 * The data of the matched route
 * @typedef {{[key: string]: string}} RouteParams
 */

/**
 * A matched route.
 * @typedef {{ params: RouteParams, url: URL }} Route
 */

/**
 * A route object.
 * @typedef {object} RouteConfig
 * @prop {(route?: Route) => DocumentFragment} render - Calls this
 *       function on matched route and renders the returned document
 *       fragment
 */

/**
 * Map a pathname to a route.
 * @typedef {Map<string | symbol, RouteConfig>} RouteMap
 */

/**
 * Find a route in route map that that matches the root and pathname.
 *
 * @param {string} root
 * @param {URL} url
 * @param {RouteMap} routes
 *
 * @returns {{config: RouteConfig, route: Route}} The matched route.
 */
export function findRoute(root, url, routes) {
  const { pathname } = url;
  const rootSegments = root.split("/").filter((segment) => segment.length > 0);
  const targetSegments = pathname
    .split("/")
    .filter((segment) => segment.length > 0);

  if (rootSegments.some((segment, i) => segment !== targetSegments[i])) {
    return {
      config: MISSING_ROUTE,
      route: { params: {}, url },
    };
  }

  const targetSubpathSegments = targetSegments.slice(rootSegments.length);

  for (const [key, config] of routes) {
    if (typeof key !== "string") {
      continue;
    }

    const subpathSegments = key
      .split("/")
      .filter((segment) => segment.length > 0);

    if (
      subpathSegments.length === targetSubpathSegments.length &&
      subpathSegments.every(
        (segment, i) =>
          segment.startsWith(":") || segment === targetSubpathSegments[i],
      )
    ) {
      /** @type {RouteParams} */
      const params = {};
      subpathSegments.forEach((segment, i) => {
        if (segment.startsWith(":")) {
          params[segment.slice(1)] = targetSubpathSegments[i];
        }
      });

      return { config, route: { params, url } };
    }
  }

  return {
    config: routes.get(NOT_FOUND) || MISSING_ROUTE,
    route: { params: {}, url },
  };
}
