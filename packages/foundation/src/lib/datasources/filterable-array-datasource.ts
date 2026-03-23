import type { FilterExpression } from "../types/filter";
import { ArrayDatasource } from "./array-datasource";

/**
 * An in-memory array datasource that supports filtering via a
 * {@link FilterExpression}.
 *
 * When an expression is applied the datasource compiles it into a
 * single predicate, re-derives its visible rows from the original
 * data, and exposes only the matching items. The underlying array
 * is never mutated.
 *
 * @typeParam T - The row object type.
 *
 * @example
 * ```ts
 * const ds = new FilterableArrayDatasource(employees);
 * ds.filterBy([{ predicate: row => row.age > 30 }]);
 * ```
 */
export class FilterableArrayDatasource<T> extends ArrayDatasource<T> {
  /** The full, unfiltered dataset. */
  private readonly _allRows: readonly T[];

  /** The currently visible (filtered) rows. */
  private _filteredRows: readonly T[];

  /**
   * The full, unfiltered dataset.
   *
   * Useful when consumers need to inspect the original data while a
   * filter is active (e.g. to infer field types from a sample row
   * without the result disappearing when the filter yields no matches).
   */
  public get allRows(): readonly T[] {
    return this._allRows;
  }

  public constructor(data: T[]) {
    super(data);
    this._allRows = [...data];
    this._filteredRows = this._allRows;
  }

  // ── IDatasource overrides ─────────────────────────────────────────

  public override getNumberOfItems(): number {
    return this._filteredRows.length;
  }

  public override getObjectAtRowIndex(rowIndex: number): T {
    if (rowIndex < 0 || rowIndex >= this._filteredRows.length) {
      throw new RangeError(
        "rowIndex must be >= 0 and < the number of filtered items",
      );
    }
    return this._filteredRows[rowIndex];
  }

  // ── IFilterableDatasource ─────────────────────────────────────────

  /**
   * Applies a structured {@link FilterExpression} to the datasource.
   *
   * The expression is compiled into a single predicate once, which is
   * then applied to every row. Pass an empty array (or `null` /
   * `undefined`) to clear the filter and show all rows.
   *
   * - **Property-level** entries test a single property value.
   * - **Row-level** entries test the entire row object.
   * - All entries must pass (AND) for a row to be included.
   */
  public filterBy(expression: FilterExpression<T> | null | undefined): void {
    if (!expression || expression.length === 0) {
      this._filteredRows = this._allRows;
      return;
    }

    const predicate = this.compileExpression(expression);
    this._filteredRows = this._allRows.filter(predicate);
  }

  // ── Private helpers ───────────────────────────────────────────────

  /**
   * Compiles a {@link FilterExpression} into a single predicate
   * function that can be applied to all rows.
   */
  private compileExpression(
    expression: FilterExpression<T>,
  ): (row: T) => boolean {
    const tests = expression.map((entry) => {
      if ("property" in entry) {
        const { property, predicate } = entry;
        return (row: T) => predicate(row[property]);
      }
      const { predicate } = entry;
      return (row: T) => predicate(row);
    });

    return (row: T) => tests.every((test) => test(row));
  }

  /** Clears any active filter, restoring all rows. */
  public clearFilter(): void {
    this._filteredRows = this._allRows;
  }
}
