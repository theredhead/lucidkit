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
