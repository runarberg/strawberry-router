export const MISSING_ROUTE = {
  render() {
    return new DocumentFragment();
  },
};

/**
 * Used to render a 404 not found page
 * @type {symbol}
 */
export const NOT_FOUND = Symbol("not found");
