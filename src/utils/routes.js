import { MISSING_ROUTE, NOT_FOUND } from "./globals.js";

/**
 * A route object.
 * @typedef {object} Route
 * @prop {() => DocumentFragment} render - Calls this function on
 *       matched route and renders the returned document fragment
 */

/**
 * Map a pathname to a route.
 * @typedef {Map<(string | NOT_FOUND), Route>} RouteMap
 */

/**
 * Find a route in route map that that matches the root and pathname.
 *
 * @param {string} root
 * @param {string} pathname
 * @param {RouteMap} routes
 *
 * @returns {Route} The matched route.
 */
export function findRoute(root, pathname, routes) {
  const normalized = pathname.replace(/\/$/, "");

  for (const [subPath, route] of routes) {
    if (typeof subPath !== "string") {
      continue;
    }

    const fullPath = `${root}/${subPath}`
      .replace(/\/+/g, "/")
      .replace(/\/$/, "");

    if (fullPath === normalized) {
      return route;
    }
  }

  return routes.get(NOT_FOUND) || MISSING_ROUTE;
}
