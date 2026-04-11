import type { SortState } from "./table-view-header/table-view-header.component";

/**
 * Compiles a {@link SortState} into a comparator function for use with
 * {@link ISortableDatasource.sortBy | ISortableDatasource.sortBy()}.
 *
 * The comparator performs locale-aware string comparison by default, treating
 * all values as strings. Numeric and date comparisons are not supported — if
 * you need custom comparison logic, pass a custom comparator directly to the
 * datasource.
 *
 * @param state - The sort state (key and direction), or null/undefined for no sorting.
 * @returns A comparator function `(a, b) => number`, or `null` if state is null/undefined.
 *
 * @example
 * ```ts
 * import { toComparator } from '@theredhead/lucid-kit';
 * import { SortableArrayDatasource } from '@theredhead/lucid-foundation';
 *
 * const ds = new SortableArrayDatasource(items);
 * const state = { key: 'name', direction: 'asc' };
 * ds.applyComparator(toComparator(state));
 * ```
 */
export function toComparator<T extends Record<string, unknown>>(
  state: SortState | null | undefined,
): ((a: T, b: T) => number) | null {
  if (!state) {
    return null;
  }

  return (a: T, b: T): number => {
    const va = String((a as Record<string, unknown>)[state.key] ?? "");
    const vb = String((b as Record<string, unknown>)[state.key] ?? "");
    const cmp = va.localeCompare(vb);
    return state.direction === "asc" ? cmp : -cmp;
  };
}
