/**
 * Layout mode for the search-view results area.
 *
 * - `'table'` — renders an internal `<ui-table-view>` using projected columns.
 * - `'custom'` — renders the projected `#results` template, giving the
 *   consumer full control over the results layout.
 */
export type SearchViewLayout = "table" | "custom";

/**
 * Context object provided to the projected `#results` template.
 *
 * @typeParam T - The row object type.
 */
export interface SearchViewResultsContext<T> {

  /** The current slice of items (also available as `let-items`). */
  $implicit: readonly T[];
}

/**
 * Context object provided to the projected `#empty` template.
 */
export interface SearchViewEmptyContext {

  /** The current search/filter state produced zero results. */
  $implicit: true;
}
