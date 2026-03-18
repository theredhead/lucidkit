/**
 * Type guards for datasource capability detection.
 *
 * Use these guards in UI components to check if a datasource supports optional
 * capabilities before calling those methods. This enables graceful degradation
 * and supports datasources with arbitrary capability combinations.
 *
 * @example
 * ```ts
 * export class UIMyTable {
 *   public readonly datasource = input.required<IDataSource<Item>>();
 *
 *   protected handleFilter(expression: FilterExpression<Item>): void {
 *     const ds = this.datasource();
 *     if (isFilterableDataSource(ds)) {
 *       ds.filterBy(expression);
 *     }
 *     // Otherwise, silently ignore filter request; table shows all data
 *   }
 *
 *   protected handleSort(expression: SortExpression<Item>): void {
 *     const ds = this.datasource();
 *     if (isSortableDataSource(ds)) {
 *       ds.sortBy(expression);
 *     }
 *     // Otherwise, silently ignore sort request; table shows insertion order
 *   }
 * }
 * ```
 */

import type {
  IPageableDataSource,
  IFilterableDataSource,
  ISortableDataSource,
  ITreeDataSource,
  IFilterableTreeDataSource,
} from "./contracts";

/**
 * Check if a datasource supports paging.
 *
 * @param datasource The datasource to check.
 * @returns True if datasource implements `IPageableDataSource`; false otherwise.
 */
export function isPageableDataSource(
  datasource: unknown,
): datasource is IPageableDataSource {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return (
    typeof obj.getPageIndex === "function" &&
    typeof obj.setPageIndex === "function" &&
    typeof obj.getPageSize === "function" &&
    typeof obj.setPageSize === "function"
  );
}

/**
 * Check if a datasource supports filtering.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `IFilterableDataSource<T>`; false otherwise.
 */
export function isFilterableDataSource<T>(
  datasource: unknown,
): datasource is IFilterableDataSource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj.filterBy === "function";
}

/**
 * Check if a datasource supports sorting.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `ISortableDataSource<T>`; false otherwise.
 */
export function isSortableDataSource<T>(
  datasource: unknown,
): datasource is ISortableDataSource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj.sortBy === "function";
}

/**
 * Check if a datasource is a tree datasource.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `ITreeDataSource<T>`; false otherwise.
 */
export function isTreeDataSource<T>(
  datasource: unknown,
): datasource is ITreeDataSource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return (
    typeof obj.getRootNodes === "function" &&
    typeof obj.getChildren === "function" &&
    typeof obj.hasChildren === "function"
  );
}

/**
 * Check if a tree datasource supports filtering.
 *
 * Note: This guard checks for both tree behavior and filtering capability.
 * You typically want to use `isTreeDataSource()` first to establish that it's a tree,
 * then separately check `isFilterableDataSource()` if you need filtering.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements both `ITreeDataSource<T>` and filtering; false otherwise.
 */
export function isFilterableTreeDataSource<T>(
  datasource: unknown,
): datasource is IFilterableTreeDataSource<T> {
  if (!isTreeDataSource<T>(datasource)) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj.filterBy === "function";
}
