/** Direction in which a column can be sorted. */
export enum SortDirection {

  /** Sort values from lowest to highest (A → Z, 0 → 9). */
  Ascending = "asc",

  /** Sort values from highest to lowest (Z → A, 9 → 0). */
  Descending = "desc",
}

/**
 * An ordered list of sort criteria applied to a datasource.
 *
 * The first entry is the primary sort; subsequent entries act as
 * tie-breakers.
 *
 * @typeParam T - The row object type.
 */
export type SortExpression<T> = {

  /** The property of `T` to sort by. */
  columnKey: keyof T;

  /** Whether to sort ascending or descending. */
  direction: SortDirection;
}[];

/**
 * Compare two raw values with type-aware ordering.
 *
 * - Two numbers → numeric comparison.
 * - Two Dates → timestamp comparison.
 * - Everything else → locale-aware string comparison via `String()`.
 * - `null` / `undefined` sort after all other values (stable).
 *
 * @internal
 */
function compareValues(a: unknown, b: unknown): number {
  // Treat null/undefined as empty — push to the end.
  const isNilA = a === null || a === undefined;
  const isNilB = b === null || b === undefined;
  if (isNilA && isNilB) return 0;
  if (isNilA) return 1;
  if (isNilB) return -1;

  // Both numbers → numeric.
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  // Both Dates → timestamp.
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  // Fallback → locale-aware string comparison.
  return String(a).localeCompare(String(b));
}

/**
 * Compiles a {@link SortExpression} into a comparator function.
 *
 * Uses locale-aware string comparison by default. The first entry is the
 * primary sort; subsequent entries act as tie-breakers.
 *
 * @typeParam T - The row object type.
 * @param expression - The sort expression to compile.
 * @returns A comparator function `(a, b) => number`.
 *
 * @example
 * ```ts
 * const cmp = compileSortExpression<Employee>([
 *   { columnKey: 'department', direction: SortDirection.Ascending },
 *   { columnKey: 'name', direction: SortDirection.Ascending },
 * ]);
 * const sorted = employees.sort(cmp);
 * ```
 */
export function compileSortExpression<T>(
  expression: SortExpression<T>,
): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    for (const criterion of expression) {
      const key = criterion.columnKey as string;
      const ra = (a as Record<string, unknown>)[key];
      const rb = (b as Record<string, unknown>)[key];
      const cmp = compareValues(ra, rb);
      if (cmp !== 0) {
        return criterion.direction === SortDirection.Ascending ? cmp : -cmp;
      }
    }
    return 0;
  };
}

/**
 * Compiles a {@link SortExpression} into a comparator for {@link TreeNode} objects.
 *
 * Like {@link compileSortExpression} but reaches into `node.data` to access
 * the sort key, which is the standard layout for tree datasources.
 *
 * @typeParam T - The data payload type carried by each tree node.
 * @param expression - The sort expression to compile.
 * @returns A comparator function `(a, b) => number` operating on tree nodes.
 */
export function compileTreeSortExpression<T>(
  expression: SortExpression<T>,
): (a: { data: T }, b: { data: T }) => number {
  return (a: { data: T }, b: { data: T }): number => {
    for (const criterion of expression) {
      const key = criterion.columnKey as string;
      const ra = (a.data as Record<string, unknown>)[key];
      const rb = (b.data as Record<string, unknown>)[key];
      const cmp = compareValues(ra, rb);
      if (cmp !== 0) {
        return criterion.direction === SortDirection.Ascending ? cmp : -cmp;
      }
    }
    return 0;
  };
}
