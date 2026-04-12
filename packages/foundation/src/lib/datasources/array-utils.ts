/**
 * Pure-function array helpers for reorder and transfer operations.
 *
 * These are the building blocks that datasource implementations
 * (e.g. `ArrayDatasource` subclasses) can use internally, and that
 * consumers can use directly when working with plain arrays.
 *
 * Both functions mutate the arrays **in place** so datasource
 * implementations can operate directly on their backing store.
 */
/**
 * Moves an item within `array` from `fromIndex` to `toIndex`,
 * shifting other elements to accommodate. The array is mutated
 * **in place**.
 *
 * @typeParam T - The item type.
 * @param array     - The array to mutate.
 * @param fromIndex - Current zero-based index of the item to move.
 * @param toIndex   - Desired zero-based index for the item.
 *
 * @example
 * ```ts
 * const items = ['a', 'b', 'c', 'd'];
 * moveItemInArray(items, 0, 2);
 * // items → ['b', 'c', 'a', 'd']
 * ```
 */
export function moveItemInArray<T>(
  array: T[],
  fromIndex: number,
  toIndex: number,
): void {
  if (fromIndex < 0 || fromIndex >= array.length) {
    throw new RangeError("fromIndex must be >= 0 and < the size of the array");
  }
  if (toIndex < 0 || toIndex >= array.length) {
    throw new RangeError("toIndex must be >= 0 and < the size of the array");
  }
  const [item] = array.splice(fromIndex, 1);
  array.splice(toIndex, 0, item);
}

/**
 * Removes the item at `fromIndex` from `source` and inserts it into
 * `target` at `toIndex`. Both arrays are mutated **in place**.
 *
 * @typeParam T - The item type.
 * @param source    - The array to remove from.
 * @param fromIndex - Zero-based index of the item to remove from `source`.
 * @param target    - The array to insert into.
 * @param toIndex   - Zero-based index at which to insert into `target`.
 *
 * @example
 * ```ts
 * const src = ['a', 'b', 'c'];
 * const tgt = ['x', 'y'];
 * moveItemToArray(src, 1, tgt, 1);
 * // src → ['a', 'c']
 * // tgt → ['x', 'b', 'y']
 * ```
 */
export function moveItemToArray<T>(
  source: T[],
  fromIndex: number,
  target: T[],
  toIndex: number,
): void {
  if (fromIndex < 0 || fromIndex >= source.length) {
    throw new RangeError(
      "fromIndex must be >= 0 and < the size of the source array",
    );
  }
  if (toIndex < 0 || toIndex > target.length) {
    throw new RangeError(
      "toIndex must be >= 0 and <= the size of the target array",
    );
  }
  const [item] = source.splice(fromIndex, 1);
  target.splice(toIndex, 0, item);
}

// ── Pure (non-mutating) variants ────────────────────────────────────

/**
 * Returns a **new** array with the item at `fromIndex` relocated to
 * `toIndex`. The original array is not modified.
 *
 * @typeParam T - The item type.
 * @param array     - The source array (not mutated).
 * @param fromIndex - Current zero-based index of the item to move.
 * @param toIndex   - Desired zero-based index for the item.
 * @returns A new array with the item relocated.
 *
 * @example
 * ```ts
 * const result = moveItemInArrayPure(['a', 'b', 'c', 'd'], 0, 2);
 * // result → ['b', 'c', 'a', 'd']
 * ```
 */
export function moveItemInArrayPure<T>(
  array: readonly T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (fromIndex < 0 || fromIndex >= array.length) {
    throw new RangeError("fromIndex must be >= 0 and < the size of the array");
  }
  if (toIndex < 0 || toIndex >= array.length) {
    throw new RangeError("toIndex must be >= 0 and < the size of the array");
  }
  const result = [...array];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
}

/**
 * Returns **new** copies of `source` and `target` with the item at
 * `fromIndex` removed from `source` and inserted into `target` at
 * `toIndex`. The original arrays are not modified.
 *
 * @typeParam T - The item type.
 * @param source    - The array to remove from (not mutated).
 * @param fromIndex - Zero-based index of the item to remove from `source`.
 * @param target    - The array to insert into (not mutated).
 * @param toIndex   - Zero-based index at which to insert into `target`.
 * @returns A tuple `[newSource, newTarget]` with the transfer applied.
 *
 * @example
 * ```ts
 * const [src, tgt] = moveItemToArrayPure(
 *   ['a', 'b', 'c'], 1,
 *   ['x', 'y'],       1,
 * );
 * // src → ['a', 'c']
 * // tgt → ['x', 'b', 'y']
 * ```
 */
export function moveItemToArrayPure<T>(
  source: readonly T[],
  fromIndex: number,
  target: readonly T[],
  toIndex: number,
): [source: T[], target: T[]] {
  if (fromIndex < 0 || fromIndex >= source.length) {
    throw new RangeError(
      "fromIndex must be >= 0 and < the size of the source array",
    );
  }
  if (toIndex < 0 || toIndex > target.length) {
    throw new RangeError(
      "toIndex must be >= 0 and <= the size of the target array",
    );
  }
  const newSource = [...source];
  const [item] = newSource.splice(fromIndex, 1);
  const newTarget = [...target];
  newTarget.splice(toIndex, 0, item);
  return [newSource, newTarget];
}
