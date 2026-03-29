import { moveItemInArray } from "./array-utils";
import type {
  IDatasource,
  IInsertableDatasource,
  IReorderableDatasource,
  IRemovableDatasource,
  RowResult,
} from "./datasource";

/**
 * Simple in-memory datasource backed by an array.
 *
 * The constructor takes a defensive copy of the provided data so that
 * external mutations to the source array do not affect the table.
 *
 * Implements {@link IReorderableDatasource}, {@link IInsertableDatasource},
 * and {@link IRemovableDatasource} so UI components can reorder items
 * and transfer items between datasources via the capability-detection
 * pattern.
 *
 * @typeParam T - The row object type.
 */
export class ArrayDatasource<T>
  implements
    IDatasource<T>,
    IReorderableDatasource<T>,
    IInsertableDatasource<T>,
    IRemovableDatasource<T>
{
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

  /** @inheritdoc */
  public moveItem(fromIndex: number, toIndex: number): void {
    moveItemInArray(this.rows, fromIndex, toIndex);
  }

  /** @inheritdoc */
  public insertItem(index: number, item: T): void {
    if (index < 0 || index > this.rows.length) {
      throw new RangeError(
        "index must be >= 0 and <= the size of the collection",
      );
    }
    this.rows.splice(index, 0, item);
  }

  /** @inheritdoc */
  public removeItem(index: number): T {
    if (index < 0 || index >= this.rows.length) {
      throw new RangeError(
        "index must be >= 0 and < the size of the collection",
      );
    }
    const [item] = this.rows.splice(index, 1);
    return item;
  }
}
