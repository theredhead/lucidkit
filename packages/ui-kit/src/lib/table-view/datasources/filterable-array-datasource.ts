import { ArrayDatasource } from "@theredhead/lucid-foundation";

import type { CompiledFilter } from "../../core/types/filter";
import { inferFilterFields } from "../../filter/infer-filter-fields";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../filter/filter.types";
import { toFilterExpression } from "../../filter/filter.utils";
import type { IFilterableDatasource } from "./datasource";

/**
 * Public ui-kit filterable datasource that accepts the serializable
 * {@link FilterExpression} emitted by {@link UIFilter}.
 *
 * The compiled predicate form remains an internal implementation detail.
 * This wrapper infers filter field metadata from the first row and
 * compiles the descriptor before delegating to the foundation datasource.
 *
 * @typeParam T - The row object type.
 */
export class FilterableArrayDatasource<T = unknown>
  extends ArrayDatasource<T>
  implements IFilterableDatasource<T>
{
  /** The full, unfiltered dataset. */
  private readonly _allRows: readonly T[];

  /** The currently visible rows. */
  private _filteredRows: readonly T[];

  /** Full unfiltered rows, retained for field inference and reset. */
  public get allRows(): readonly T[] {
    return this._allRows;
  }

  public constructor(data: T[]) {
    super(data);
    this._allRows = this.rows;
    this._filteredRows = this._allRows;
  }

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

  /**
   * Applies a serializable filter descriptor to the datasource.
   *
   * Pass `null`, `undefined`, or an empty rule list to clear the filter.
   */
  public filterBy(expression: FilterExpression<T> | null | undefined): void {
    if (!expression || expression.rules.length === 0) {
      this._filteredRows = this._allRows;
    } else {
      const compiled = toFilterExpression(
        expression,
        this.resolveFilterFields(),
      );
      this._filteredRows =
        compiled.length === 0
          ? this._allRows
          : this._allRows.filter(this.compileExpression(compiled));
    }

    this.noteRowRangeChanged.emit({
      range: { start: 0, length: this._filteredRows.length },
    });
  }

  /** Clears any active filter and restores all rows. */
  public clearFilter(): void {
    this.filterBy(null);
  }

  private resolveFilterFields(): FilterFieldDefinition<T>[] {
    const sampleRow = this.allRows[0];
    return sampleRow
      ? (inferFilterFields(
          sampleRow as Record<string, unknown>,
        ) as FilterFieldDefinition<T>[])
      : [];
  }

  private compileExpression(
    expression: CompiledFilter<T>,
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
}
