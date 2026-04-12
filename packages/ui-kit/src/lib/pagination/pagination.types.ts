/** A page change event emitted by UIPagination. */
export interface PageChangeEvent {

  /** Zero-based page index. */
  readonly pageIndex: number;

  /** Number of items per page. */
  readonly pageSize: number;

  /** Total number of items (if known). */
  readonly totalItems: number;
}
