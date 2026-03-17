import type { Predicate } from "@angular/core";

import type { FilterExpression } from "../types/filter";
import { ArrayDatasource } from "./array-datasource";

/**
 * An in-memory array datasource that supports filtering via a
 * `Predicate<T>` or a `FilterExpression<T>`.
 *
 * When a predicate is applied the datasource re-derives its visible
 * rows from the original data. The underlying array is never mutated.
 *
 * @typeParam T - The row object type.
 *
 * @example
 * ```ts
 * const ds = new FilterableArrayDatasource(employees);
 * ds.applyPredicate(row => row.age > 30);
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
   * Every element in the expression array is evaluated per row:
   * - **Property-level** predicates receive the value of the specified
   *   property.
   * - **Row-level** predicates receive the entire row object.
   *
   * All predicates must pass (AND) for a row to be included.
   */
  public filterBy(expression: FilterExpression<T>): void {
    if (!expression || expression.length === 0) {
      this._filteredRows = this._allRows;
      return;
    }

    this._filteredRows = this._allRows.filter((row) =>
      expression.every((entry) => {
        if ("property" in entry) {
          return entry.predicate(row[entry.property]);
        }
        return entry.predicate(row);
      }),
    );
  }

  // ── Convenience: raw Predicate<T> ─────────────────────────────────

  /**
   * Applies a single `Predicate<T>` to filter the datasource.
   *
   * Pass `null` or `undefined` to clear the filter and show all rows.
   */
  public applyPredicate(predicate: Predicate<T> | null | undefined): void {
    if (!predicate) {
      this._filteredRows = this._allRows;
      return;
    }
    this._filteredRows = this._allRows.filter(predicate);
  }

  /** Clears any active filter, restoring all rows. */
  public clearFilter(): void {
    this._filteredRows = this._allRows;
  }
}
