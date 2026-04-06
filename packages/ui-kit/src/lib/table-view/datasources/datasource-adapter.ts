import { computed, signal, type WritableSignal } from "@angular/core";

import { INITIAL_PAGE_SIZE } from "../table-view.constants";

import type { IDatasource, RangeDefinition, RowResult } from "./datasource";

/**
 * Wraps any {@link IDatasource} and exposes paginated, signal-based
 * access to its rows.
 *
 * The adapter subscribes to the datasource's {@link IActiveDatasource.noteRowRangeChanged}
 * emitter (when present) so that {@link totalItems} and
 * {@link totalItemsApproximate} stay in sync as the datasource
 * discovers more data.
 *
 * @typeParam T - The row object type.
 */
export class DatasourceAdapter<T> {
  readonly pageIndex: WritableSignal<number> = signal<number>(0);
  readonly pageSize: WritableSignal<number>;
  readonly totalItems = signal<number | null>(null);
  readonly totalItemsApproximate = signal<boolean>(false);
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
    public readonly datasource: IDatasource<T>,
    initialPageSize: number = INITIAL_PAGE_SIZE,
  ) {
    if (!Number.isFinite(initialPageSize) || initialPageSize <= 0) {
      throw new RangeError("initialPageSize must be a positive number");
    }

    this.pageSize = signal<number>(initialPageSize);
    this.refreshTotalItems();

    // Subscribe to row-range changes so totalItems stays current as
    // the datasource pages through server data.
    const active = datasource as unknown as Record<string, unknown>;
    const emitter = active["noteRowRangeChanged"];
    if (
      emitter &&
      typeof (emitter as { subscribe?: unknown }).subscribe === "function"
    ) {
      (emitter as { subscribe: (fn: () => void) => () => void }).subscribe(() =>
        this.refreshTotalItems(),
      );
    }
  }

  private refreshTotalItems(): void {
    const raw = this.datasource.getNumberOfItems();
    if (typeof raw === "number") {
      this.applyCount(raw);
    } else {
      raw.then((n) => this.applyCount(n));
    }
  }

  /**
   * Decode the count value:
   * - Integer → exact total
   * - Non-integer (e.g. 100.5) → approximate total (floor is the count)
   */
  private applyCount(raw: number): void {
    const approximate = raw % 1 !== 0;
    this.totalItems.set(Math.floor(raw));
    this.totalItemsApproximate.set(approximate);
  }

  private getItemsInRange(range: RangeDefinition): RowResult<T>[] {
    const total = this.totalItems();
    const approximate = this.totalItemsApproximate();
    const end =
      total != null && !approximate
        ? Math.min(range.start + range.length, total)
        : range.start + range.length;

    const result: RowResult<T>[] = [];
    for (let rowIndex = range.start; rowIndex < end; rowIndex++) {
      result.push(this.datasource.getObjectAtRowIndex(rowIndex));
    }
    return result;
  }
}
