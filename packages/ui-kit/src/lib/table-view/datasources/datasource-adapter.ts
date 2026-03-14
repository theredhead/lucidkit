import { computed, signal, type WritableSignal } from "@angular/core";

import { INITIAL_PAGE_SIZE } from "../table-view.constants";

import type { IDatasource, RangeDefinition, RowResult } from "./datasource";

/**
 * Wraps any {@link IDatasource} and exposes paginated, signal-based
 * access to its rows.
 *
 * @typeParam T - The row object type.
 */
export class DatasourceAdapter<T> {
  readonly pageIndex: WritableSignal<number> = signal<number>(0);
  readonly pageSize: WritableSignal<number>;
  readonly totalItems = signal<number | null>(null);
  readonly visibleRange = computed(() => {
    const index = this.pageIndex();
    const length = this.pageSize();
    const start = index * length;
    return { start, length };
  });
  readonly visibleWindow = computed(() =>
    this.getItemsInRange(this.visibleRange()),
  );

  constructor(
    private datasource: IDatasource<T>,
    initialPageSize: number = INITIAL_PAGE_SIZE,
  ) {
    if (!Number.isFinite(initialPageSize) || initialPageSize <= 0) {
      throw new RangeError("initialPageSize must be a positive number");
    }

    this.pageSize = signal<number>(initialPageSize);

    const count = datasource.getNumberOfItems();
    if (typeof count === "number") {
      // Synchronous datasource — set immediately so the first
      // visibleWindow computed can clamp correctly.
      this.totalItems.set(count);
    } else {
      count.then((n) => this.totalItems.set(n));
    }
  }

  private getItemsInRange(range: RangeDefinition): RowResult<T>[] {
    const total = this.totalItems();
    const end =
      total != null
        ? Math.min(range.start + range.length, total)
        : range.start + range.length;

    const result: RowResult<T>[] = [];
    for (let rowIndex = range.start; rowIndex < end; rowIndex++) {
      result.push(this.datasource.getObjectAtRowIndex(rowIndex));
    }
    return result;
  }
}
