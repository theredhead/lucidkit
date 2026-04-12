import { moveItemInArray } from "./array-utils";
import type {
  IActiveDatasource,
  IDatasource,
  IInsertableDatasource,
  IReorderableDatasource,
  IRemovableDatasource,
  RowResult,
} from "./datasource";
import type {
  RowChangedNotification,
  RowRangeChangedNotification,
} from "../types/notifications";
import { Emitter } from "../types/emitter";

/**
 * Simple in-memory datasource backed by an array.
 *
 * The constructor takes a defensive copy of the provided data so that
 * external mutations to the source array do not affect the table.
 *
 * Implements {@link IActiveDatasource} so that UI components
 * automatically stay in sync when rows are inserted, removed, moved,
 * or individually mutated (via {@link notifyRowChanged}).
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
    IActiveDatasource<T>,
    IReorderableDatasource<T>,
    IInsertableDatasource<T>,
    IRemovableDatasource<T>
{

  /** @inheritdoc */
  public readonly noteRowChanged = new Emitter<RowChangedNotification>();

  /** @inheritdoc */
  public readonly noteRowRangeChanged =
    new Emitter<RowRangeChangedNotification>();

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

  /**
   * Notifies consumers that the row at the given index has been
   * externally mutated (e.g. property values changed in-place).
   *
   * Call this after directly modifying a row object so that any
   * listening UI (such as a table view) can re-read the data.
   *
   * @param rowIndex - Zero-based index of the changed row.
   */
  public notifyRowChanged(rowIndex: number): void {
    this.noteRowChanged.emit({ rowIndex });
  }

  /**
   * Notifies consumers that all visible data should be considered
   * stale. Call this after bulk mutations that affect many rows.
   */
  public notifyDataChanged(): void {
    this.noteRowRangeChanged.emit({
      range: { start: 0, length: this.rows.length },
    });
  }

  /** @inheritdoc */
  public moveItem(fromIndex: number, toIndex: number): void {
    moveItemInArray(this.rows, fromIndex, toIndex);
    this.noteRowRangeChanged.emit({
      range: {
        start: Math.min(fromIndex, toIndex),
        length: Math.abs(toIndex - fromIndex) + 1,
      },
    });
  }

  /** @inheritdoc */
  public insertItem(index: number, item: T): void {
    if (index < 0 || index > this.rows.length) {
      throw new RangeError(
        "index must be >= 0 and <= the size of the collection",
      );
    }
    this.rows.splice(index, 0, item);
    this.noteRowRangeChanged.emit({
      range: { start: index, length: this.rows.length - index },
    });
  }

  /** @inheritdoc */
  public removeItem(index: number): T {
    if (index < 0 || index >= this.rows.length) {
      throw new RangeError(
        "index must be >= 0 and < the size of the collection",
      );
    }
    const [item] = this.rows.splice(index, 1);
    this.noteRowRangeChanged.emit({
      range: { start: index, length: this.rows.length - index + 1 },
    });
    return item;
  }
}
