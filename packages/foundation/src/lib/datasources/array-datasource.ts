import type { IDatasource, RowResult } from "./datasource";

/**
 * Simple in-memory datasource backed by an array.
 *
 * The constructor takes a defensive copy of the provided data so that
 * external mutations to the source array do not affect the table.
 *
 * @typeParam T - The row object type.
 */
export class ArrayDatasource<T> implements IDatasource<T> {
  protected readonly rows: T[];

  public constructor(data: T[]) {
    // Defensive copy so callers cannot mutate table data externally.
    this.rows = [...data];
  }

  public getNumberOfItems(): number | Promise<number> {
    return this.rows.length;
  }

  public getObjectAtRowIndex(rowIndex: number): RowResult<T> {
    if (rowIndex < 0 || rowIndex >= this.rows.length) {
      throw new RangeError(
        "rowIndex must be >= 0 and < the size of the collection",
      );
    }

    return this.rows[rowIndex];
  }
}
