/**
 * Defines a contiguous range of row indices.
 *
 * Used to request a slice of data from a datasource (e.g. for
 * virtual scrolling or pagination).
 */
export interface RangeDefinition {
  /** Zero-based index of the first row in the range. */
  start: number;
  /** Number of rows in the range. */
  length: number;
}
