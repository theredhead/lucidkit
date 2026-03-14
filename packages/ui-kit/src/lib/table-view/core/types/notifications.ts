import type { RangeDefinition } from "./range";

/** Notification emitted when a single row's data has changed. */
export interface RowChangedNotification {
  /** Zero-based index of the changed row. */
  rowIndex: number;
}

/** Notification emitted when a contiguous range of rows has changed. */
export interface RowRangeChangedNotification {
  /** The range of rows that changed. */
  range: RangeDefinition;
}
