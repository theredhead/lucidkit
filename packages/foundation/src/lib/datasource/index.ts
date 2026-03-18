/**
 * @theredhead/foundation — Datasource Architecture
 *
 * Base datasource contracts and capability interfaces for data-displaying UI controls.
 *
 * @example
 * Implementing a simple read-only datasource:
 *
 * ```ts
 * import { IDataSource } from '@theredhead/foundation';
 *
 * export class SimpleArrayDataSource<T> implements IDataSource<T> {
 *   constructor(private items: T[]) {}
 *
 *   public getNumberOfItems(): number {
 *     return this.items.length;
 *   }
 *
 *   public getObjectAtRowIndex(index: number): T {
 *     return this.items[index];
 *   }
 * }
 * ```
 *
 * Using type guards to detect optional capabilities:
 *
 * ```ts
 * import {
 *   IDataSource,
 *   isFilterableDataSource,
 *   isSortableDataSource,
 * } from '@theredhead/foundation';
 *
 * export class UIMyTable<T> {
 *   protected readonly datasource = input.required<IDataSource<T>>();
 *
 *   protected handleFilter(expression: FilterExpression<T>): void {
 *     const ds = this.datasource();
 *     if (isFilterableDataSource(ds)) {
 *       ds.filterBy(expression);
 *       // Re-render table with filtered data
 *     }
 *   }
 *
 *   protected handleSort(expression: SortExpression<T>): void {
 *     const ds = this.datasource();
 *     if (isSortableDataSource(ds)) {
 *       ds.sortBy(expression);
 *       // Re-render table with sorted data
 *     }
 *   }
 * }
 * ```
 */

export type {
  IDataSource,
  IPageableDataSource,
  IFilterableDataSource,
  ISortableDataSource,
  ITreeDataSource,
  IFilterableTreeDataSource,
} from "./contracts";

export {
  isPageableDataSource,
  isFilterableDataSource,
  isSortableDataSource,
  isTreeDataSource,
  isFilterableTreeDataSource,
} from "./type-guards";
