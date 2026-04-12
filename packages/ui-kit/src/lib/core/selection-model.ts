import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from "@angular/core";

/**
 * Selection mode.
 * - `'none'`: No selection UI is shown (default).
 * - `'single'`: A radio-button column allows selecting exactly one row.
 * - `'multiple'`: A checkbox column allows selecting any number of rows.
 */
export type SelectionMode = "none" | "single" | "multiple";

/**
 * Reactive selection model that tracks selected items.
 *
 * Exposes read-only signals for the current selection and provides
 * imperative methods to toggle, set, and clear the selection.
 *
 * The model uses object-identity (`===`) to track items.
 * Consumers can optionally supply a `trackBy` function that maps each
 * item to a stable identity key (e.g. a database ID) — this makes the
 * selection survive data refreshes where the item objects are recreated
 * with new references but represent the same record.
 */
export class SelectionModel<T = unknown> {

  /** The active selection mode. */
  readonly mode: WritableSignal<SelectionMode>;

  /**
   * Optional function that returns a unique identity key for an item.
   * When provided, selection comparisons use this key instead of `===`.
   */
  readonly trackBy: ((item: T) => unknown) | undefined;

  /** Internal set of selected items (or their identity keys when trackBy is set). */
  private readonly _selected: WritableSignal<Set<unknown>>;

  /** Internal list of selected item objects (maintained in insertion order). */
  private readonly _selectedItems: WritableSignal<readonly T[]>;

  /** Read-only signal of the currently selected items, in insertion order. */
  readonly selected: Signal<readonly T[]>;

  /** Read-only signal of the number of selected items. */
  readonly selectedCount: Signal<number>;

  /** Whether nothing is selected. */
  readonly isEmpty: Signal<boolean>;

  constructor(mode: SelectionMode = "none", trackBy?: (item: T) => unknown) {
    this.mode = signal(mode);
    this.trackBy = trackBy;
    this._selected = signal(new Set<unknown>());
    this._selectedItems = signal<readonly T[]>([]);

    this.selected = this._selectedItems.asReadonly();
    this.selectedCount = computed(() => this._selectedItems().length);
    this.isEmpty = computed(() => this._selectedItems().length === 0);
  }

  // ── Query ──────────────────────────────────────────────────

  /** Returns `true` if the given item is currently selected. */
  isSelected(item: T): boolean {
    const key = this.trackBy ? this.trackBy(item) : item;
    return this._selected().has(key);
  }

  // ── Mutations ──────────────────────────────────────────────

  /** Select a single item, replacing any previous selection. */
  select(item: T): void {
    const key = this.trackBy ? this.trackBy(item) : item;
    this._selected.set(new Set([key]));
    this._selectedItems.set([item]);
  }

  /** Deselect a single item. */
  deselect(item: T): void {
    const key = this.trackBy ? this.trackBy(item) : item;
    const next = new Set(this._selected());
    next.delete(key);
    this._selected.set(next);
    this._selectedItems.set(
      this._selectedItems().filter(
        (r) => (this.trackBy ? this.trackBy(r) : r) !== key,
      ),
    );
  }

  /**
   * Toggle an item's selection state.
   *
   * In **single** mode, selecting a new item deselects the previous one.
   * In **multiple** mode, the item is added/removed independently.
   */
  toggle(item: T): void {
    if (this.isSelected(item)) {
      this.deselect(item);
    } else {
      if (this.mode() === "single") {
        this.select(item);
      } else {
        const key = this.trackBy ? this.trackBy(item) : item;
        const next = new Set(this._selected());
        next.add(key);
        this._selected.set(next);
        this._selectedItems.set([...this._selectedItems(), item]);
      }
    }
  }

  /**
   * Select all items from the provided array.
   * Only meaningful in `'multiple'` mode.
   */
  selectAll(items: readonly T[]): void {
    if (this.mode() !== "multiple") return;
    const keys = new Set<unknown>();
    for (const item of items) {
      keys.add(this.trackBy ? this.trackBy(item) : item);
    }
    this._selected.set(keys);
    this._selectedItems.set(items);
  }

  /** Clear the entire selection. */
  clear(): void {
    this._selected.set(new Set());
    this._selectedItems.set([]);
  }

  /**
   * Returns true when every item in the given array is selected.
   * Returns false for empty arrays.
   */
  isAllSelected(items: readonly T[]): boolean {
    if (items.length === 0) return false;
    return items.every((r) => this.isSelected(r));
  }

  /**
   * Returns true when at least one — but not all — items are selected.
   * Useful for the "indeterminate" checkbox state.
   */
  isPartiallySelected(items: readonly T[]): boolean {
    if (items.length === 0) return false;
    const count = items.filter((r) => this.isSelected(r)).length;
    return count > 0 && count < items.length;
  }
}

/**
 * @deprecated Use `SelectionModel` instead. This alias exists only for
 * backwards compatibility and will be removed in a future version.
 */
export const TableSelectionModel = SelectionModel;
/**
 * @deprecated Use `SelectionModel` instead.
 */
export type TableSelectionModel<T = unknown> = SelectionModel<T>;
