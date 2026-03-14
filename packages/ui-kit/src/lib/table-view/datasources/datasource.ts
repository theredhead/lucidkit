import type { FilterExpression } from "../../core/types/filter";
import type {
  RowChangedNotification,
  RowRangeChangedNotification,
} from "../../core/types/notifications";
import type { RangeDefinition } from "../../core/types/range";
import type { SortExpression } from "../../core/types/sort";
import { Emitter } from "../../core/types/emitter";

// Re-export so existing consumers that import from './datasource' keep working.
export type { FilterExpression, RangeDefinition, SortExpression };
export type { RowChangedNotification, RowRangeChangedNotification };
export { Emitter };
export { SortDirection } from "../../core/types/sort";

/**
 * Represents a single row that may or may not be immediately available.
 */
export type RowResult<T> = T | Promise<T>;

/**
 * Core datasource contract for table-view.
 *
 * Implementations provide the total item count and on-demand access
 * to individual rows by index, optionally returning a `Promise` for
 * rows that are fetched asynchronously.
 *
 * @typeParam T - The row object type.
 */
export interface IDatasource<T = any> {
  /** Returns the total number of items, synchronously or asynchronously. */
  getNumberOfItems(): number | Promise<number>;

  /**
   * Returns the row object at the given index.
   *
   * @param rowIndex - Zero-based index of the row to retrieve.
   * @returns The row value, or a `Promise` that resolves to it.
   */
  getObjectAtRowIndex(rowIndex: number): RowResult<T>;
}

/**
 * A datasource that supports server-side or in-memory sorting.
 *
 * @typeParam T - The row object type.
 */
export interface ISortableDatasource<T = any> extends IDatasource<T> {
  /**
   * Applies the given sort expression to the datasource.
   *
   * @param expression - One or more sort criteria in priority order.
   */
  sortBy(expression: SortExpression<T>): void;
}

/**
 * A datasource that supports server-side or in-memory filtering.
 *
 * @typeParam T - The row object type.
 */
export interface IFilterableDatasource<T = any> extends IDatasource<T> {
  /**
   * Applies the given filter expression to the datasource.
   *
   * @param expression - The filter criteria to apply.
   */
  filterBy(expression: FilterExpression<T>): void;
}

/**
 * A datasource that supports notifying consumers about changes
 * to specific rows or ranges of rows.
 *
 * @typeParam T - The row object type.
 */
export interface IActiveDatasource<T = any> extends IDatasource<T> {
  /**
   * Fires when a specific row has changed.
   * The event includes the index of the changed row.
   */
  noteRowChanged?: Emitter<RowChangedNotification>;
  /**
   * Fires when a range of rows has changed.
   * The event includes the definition of the changed range.
   */
  noteRowRangeChanged?: Emitter<RowRangeChangedNotification>;
}
