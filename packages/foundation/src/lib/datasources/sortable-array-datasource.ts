import { ArrayDatasource } from "./array-datasource";
import type { ISortableDatasource } from "./datasource";
import { type SortExpression, compileSortExpression } from "../types/sort";

/**
 * An in-memory array datasource that supports sorting via a comparator function.
 *
 * When a comparator is applied, the datasource re-derives its visible rows
 * from the original data. The underlying array is never mutated.
 *
 * @typeParam T - The row object type.
 *
 * @example
 * ```ts
 * const ds = new SortableArrayDatasource(employees);
 * ds.applyComparator((a, b) => a.age - b.age);
 * ```
 */
export class SortableArrayDatasource<T>
  extends ArrayDatasource<T>
  implements ISortableDatasource<T>
{
  /** The full, unsorted dataset. */
  private readonly _allRows: readonly T[];

  /** The currently sorted rows. */
  private _sortedRows: readonly T[];

  /**
   * The full, unsorted dataset.
   *
   * Useful when consumers need to inspect the original data while a
   * sort is active.
   */
  public get allRows(): readonly T[] {
    return this._allRows;
  }

  public constructor(data: T[]) {
    super(data);
    this._allRows = this.rows;
    this._sortedRows = this._allRows;
  }

  // ── IDatasource overrides ─────────────────────────────────────────

  public override getNumberOfItems(): number {
    return this._sortedRows.length;
  }

  public override getObjectAtRowIndex(rowIndex: number): T {
    if (rowIndex < 0 || rowIndex >= this._sortedRows.length) {
      throw new RangeError(
        "rowIndex must be >= 0 and < the number of sorted items",
      );
    }
    return this._sortedRows[rowIndex];
  }

  // ── ISortableDatasource ───────────────────────────────────────────

  /**
   * Applies a serializable sort expression to the datasource.
   *
   * The expression is compiled into a comparator function internally.
   * Pass `null` to clear the sort and restore the original insertion order.
   *
   * @param expression - Sort criteria, or `null` to clear.
   */
  public sortBy(expression: SortExpression<T> | null): void {
    if (!expression || expression.length === 0) {
      this.applyComparator(null);
      return;
    }
    this.applyComparator(compileSortExpression<T>(expression));
  }

  // ── Convenience: raw comparator ───────────────────────────────────

  /**
   * Applies a comparator function to sort the datasource.
   *
   * Pass `null` or `undefined` to clear the sort and restore the original
   * insertion order.
   *
   * @param comparator - The comparator function, or null/undefined to clear sorting.
   */
  public applyComparator(
    comparator: ((a: T, b: T) => number) | null | undefined,
  ): void {
    if (!comparator) {
      this._sortedRows = this._allRows;
      return;
    }
    this._sortedRows = [...this._allRows].sort(comparator);
  }
}
