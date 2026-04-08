import { computed, signal, type WritableSignal } from "@angular/core";

import { INITIAL_PAGE_SIZE } from "../table-view.constants";

import type {
  IActiveDatasource,
  IDatasource,
  RangeDefinition,
  RowResult,
} from "./datasource";

/**
 * Wraps any {@link IDatasource} and exposes paginated, signal-based
 * access to its rows.
 *
 * The adapter subscribes to the datasource's
 * {@link IActiveDatasource.noteRowChanged} and
 * {@link IActiveDatasource.noteRowRangeChanged} emitters (when
 * present) so that the visible window and total-item count stay in
 * sync as the datasource mutates.
 *
 * Call {@link dispose} when the adapter is no longer needed to
 * unsubscribe from all datasource emitters.
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

  /**
   * Bumped whenever the underlying datasource notifies that data has
   * changed. Reading this inside a `computed` causes it to recompute
   * when the data is invalidated.
   */
  private readonly _dataVersion = signal(0);

  /**
   * Public read-only view of the data-change generation counter.
   * Components can read this inside an `effect()` to establish a
   * direct reactive dependency on datasource mutations.
   */
  readonly dataVersion = this._dataVersion.asReadonly();

  readonly visibleWindow = computed(() => {
    this._dataVersion(); // depend on invalidations
    return this.getItemsInRange(this.visibleRange());
  });

  /** Teardown functions for emitter subscriptions. */
  private readonly _teardowns: (() => void)[] = [];

  constructor(
    public readonly datasource: IDatasource<T>,
    initialPageSize: number = INITIAL_PAGE_SIZE,
  ) {
    if (!Number.isFinite(initialPageSize) || initialPageSize <= 0) {
      throw new RangeError("initialPageSize must be a positive number");
    }

    this.pageSize = signal<number>(initialPageSize);
    this.refreshTotalItems();
    this.subscribeToActiveDatasource();
  }

  /**
   * Unsubscribes from all datasource emitters. Call this when the
   * adapter is replaced or destroyed to avoid memory leaks.
   */
  public dispose(): void {
    for (const teardown of this._teardowns) {
      teardown();
    }
    this._teardowns.length = 0;
  }

  /**
   * Subscribes to {@link IActiveDatasource.noteRowChanged} and
   * {@link IActiveDatasource.noteRowRangeChanged} if the datasource
   * implements them. Row-level changes invalidate the visible window;
   * range-level changes also refresh the total item count.
   */
  private subscribeToActiveDatasource(): void {
    const ds = this.datasource as Partial<IActiveDatasource<T>>;

    if (this.isSubscribable(ds.noteRowChanged)) {
      this._teardowns.push(
        ds.noteRowChanged.subscribe(() => {
          this._dataVersion.update((v) => v + 1);
        }),
      );
    }

    if (this.isSubscribable(ds.noteRowRangeChanged)) {
      this._teardowns.push(
        ds.noteRowRangeChanged.subscribe(() => {
          this.refreshTotalItems();
          this._dataVersion.update((v) => v + 1);
        }),
      );
    }
  }

  /** Duck-type check: any object with a `subscribe` function. */
  private isSubscribable(
    value: unknown,
  ): value is { subscribe: (fn: () => void) => () => void } {
    return (
      value != null &&
      typeof (value as Record<string, unknown>)["subscribe"] === "function"
    );
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
