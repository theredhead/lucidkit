import { computed, signal, type Signal, type WritableSignal } from "@angular/core";

/**
 * Selection mode for the table view.
 * - `'none'`: No selection UI is shown (default).
 * - `'single'`: A radio-button column allows selecting exactly one row.
 * - `'multiple'`: A checkbox column allows selecting any number of rows.
 */
export type SelectionMode = "none" | "single" | "multiple";

/**
 * Reactive selection model that tracks selected row objects.
 *
 * Exposes read-only signals for the current selection and provides
 * imperative methods to toggle, set, and clear the selection.
 *
 * The model uses object-identity (`===`) to track rows.
 * Consumers can optionally supply a `trackBy` function that maps each
 * row to a stable identity key (e.g. a database ID) — this makes the
 * selection survive data refreshes where the row objects are recreated
 * with new references but represent the same record.
 */
export class TableSelectionModel<T = unknown> {
  /** The active selection mode. */
  readonly mode: WritableSignal<SelectionMode>;

  /**
   * Optional function that returns a unique identity key for a row.
   * When provided, selection comparisons use this key instead of `===`.
   */
  readonly trackBy: ((row: T) => unknown) | undefined;

  /** Internal set of selected rows (or their identity keys when trackBy is set). */
  private readonly _selected: WritableSignal<Set<unknown>>;

  /** Internal list of selected row objects (maintained in insertion order). */
  private readonly _selectedRows: WritableSignal<readonly T[]>;

  /** Read-only signal of the currently selected rows, in insertion order. */
  readonly selected: Signal<readonly T[]>;

  /** Read-only signal of the number of selected rows. */
  readonly selectedCount: Signal<number>;

  /** Whether nothing is selected. */
  readonly isEmpty: Signal<boolean>;

  constructor(
    mode: SelectionMode = "none",
    trackBy?: (row: T) => unknown,
  ) {
    this.mode = signal(mode);
    this.trackBy = trackBy;
    this._selected = signal(new Set<unknown>());
    this._selectedRows = signal<readonly T[]>([]);

    this.selected = this._selectedRows.asReadonly();
    this.selectedCount = computed(() => this._selectedRows().length);
    this.isEmpty = computed(() => this._selectedRows().length === 0);
  }

  // ── Query ──────────────────────────────────────────────────

  /** Returns `true` if the given row is currently selected. */
  isSelected(row: T): boolean {
    const key = this.trackBy ? this.trackBy(row) : row;
    return this._selected().has(key);
  }

  // ── Mutations ──────────────────────────────────────────────

  /** Select a single row, replacing any previous selection. */
  select(row: T): void {
    const key = this.trackBy ? this.trackBy(row) : row;
    this._selected.set(new Set([key]));
    this._selectedRows.set([row]);
  }

  /** Deselect a single row. */
  deselect(row: T): void {
    const key = this.trackBy ? this.trackBy(row) : row;
    const next = new Set(this._selected());
    next.delete(key);
    this._selected.set(next);
    this._selectedRows.set(
      this._selectedRows().filter((r) =>
        (this.trackBy ? this.trackBy(r) : r) !== key,
      ),
    );
  }

  /**
   * Toggle a row's selection state.
   *
   * In **single** mode, selecting a new row deselects the previous one.
   * In **multiple** mode, the row is added/removed independently.
   */
  toggle(row: T): void {
    if (this.isSelected(row)) {
      this.deselect(row);
    } else {
      if (this.mode() === "single") {
        this.select(row);
      } else {
        const key = this.trackBy ? this.trackBy(row) : row;
        const next = new Set(this._selected());
        next.add(key);
        this._selected.set(next);
        this._selectedRows.set([...this._selectedRows(), row]);
      }
    }
  }

  /**
   * Select all rows from the provided array.
   * Only meaningful in `'multiple'` mode.
   */
  selectAll(rows: readonly T[]): void {
    if (this.mode() !== "multiple") return;
    const keys = new Set<unknown>();
    for (const row of rows) {
      keys.add(this.trackBy ? this.trackBy(row) : row);
    }
    this._selected.set(keys);
    this._selectedRows.set(rows);
  }

  /** Clear the entire selection. */
  clear(): void {
    this._selected.set(new Set());
    this._selectedRows.set([]);
  }

  /**
   * Returns true when every row in the given array is selected.
   * Returns false for empty arrays.
   */
  isAllSelected(rows: readonly T[]): boolean {
    if (rows.length === 0) return false;
    return rows.every((r) => this.isSelected(r));
  }

  /**
   * Returns true when at least one — but not all — rows are selected.
   * Useful for the "indeterminate" checkbox state.
   */
  isPartiallySelected(rows: readonly T[]): boolean {
    if (rows.length === 0) return false;
    const count = rows.filter((r) => this.isSelected(r)).length;
    return count > 0 && count < rows.length;
  }
}
