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
      const va = String((a as Record<string, unknown>)[key] ?? "");
      const vb = String((b as Record<string, unknown>)[key] ?? "");
      const cmp = va.localeCompare(vb);
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
      const va = String((a.data as Record<string, unknown>)[key] ?? "");
      const vb = String((b.data as Record<string, unknown>)[key] ?? "");
      const cmp = va.localeCompare(vb);
      if (cmp !== 0) {
        return criterion.direction === SortDirection.Ascending ? cmp : -cmp;
      }
    }
    return 0;
  };
}
