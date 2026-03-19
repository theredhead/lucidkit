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
 *   public readonly datasource = input.required<IDatasource<Item>>();
 *
 *   protected handleFilter(expression: unknown): void {
 *     const ds = this.datasource();
 *     if (isFilterableDatasource(ds)) {
 *       ds.filterBy(expression);
 *     }
 *     // Otherwise, silently ignore filter request; table shows all data
 *   }
 *
 *   protected handleSort(expression: unknown): void {
 *     const ds = this.datasource();
 *     if (isSortableDatasource(ds)) {
 *       ds.sortBy(expression);
 *     }
 *     // Otherwise, silently ignore sort request; table shows insertion order
 *   }
 * }
 * ```
 */

import type {
  IFilterableDatasource,
  ISortableDatasource,
  ITreeDatasource,
  IFilterableTreeDatasource,
  ISortableTreeDatasource,
} from "./datasource";

/**
 * Check if a datasource supports filtering.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `IFilterableDatasource<T>`; false otherwise.
 */
export function isFilterableDatasource<T>(
  datasource: unknown,
): datasource is IFilterableDatasource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj["filterBy"] === "function";
}

/**
 * Check if a datasource supports sorting.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `ISortableDatasource<T>`; false otherwise.
 */
export function isSortableDatasource<T>(
  datasource: unknown,
): datasource is ISortableDatasource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj["sortBy"] === "function";
}

/**
 * Check if a datasource is a tree datasource that supports filtering.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `IFilterableTreeDatasource<T>`; false otherwise.
 */
export function isFilterableTreeDatasource<T>(
  datasource: unknown,
): datasource is IFilterableTreeDatasource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj["filterBy"] === "function";
}

/**
 * Check if a datasource is a tree datasource.
 *
 * Tests for the presence of the three methods that define
 * {@link ITreeDatasource}: `getRootNodes`, `getChildren`, and
 * `hasChildren`.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns `true` if `datasource` implements `ITreeDatasource<T>`; `false` otherwise.
 */
export function isTreeDatasource<T>(
  datasource: unknown,
): datasource is ITreeDatasource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return (
    typeof obj["getRootNodes"] === "function" &&
    typeof obj["getChildren"] === "function" &&
    typeof obj["hasChildren"] === "function"
  );
}

/**
 * Check if a datasource is a tree datasource that supports sorting.
 *
 * @template T The item type (used for type narrowing).
 * @param datasource The datasource to check.
 * @returns True if datasource implements `ISortableTreeDatasource<T>`; false otherwise.
 */
export function isSortableTreeDatasource<T>(
  datasource: unknown,
): datasource is ISortableTreeDatasource<T> {
  if (datasource === null || datasource === undefined) {
    return false;
  }
  const obj = datasource as Record<string, unknown>;
  return typeof obj["applyComparator"] === "function";
}
