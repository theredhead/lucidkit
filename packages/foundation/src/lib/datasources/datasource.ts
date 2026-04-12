import type { CompiledFilter } from "../types/filter";
import type { SortExpression } from "../types/sort";
import type {
  RowChangedNotification,
  RowRangeChangedNotification,
} from "../types/notifications";
import { Emitter } from "../types/emitter";

/**
 * Represents a single row that may or may not be immediately available.
 */
export type RowResult<T> = T | Promise<T>;

/**
 * Core datasource contract for data-driven views (table, repeater, etc.).
 *
 * Implementations provide the total item count and on-demand access
 * to individual rows by index, optionally returning a `Promise` for
 * rows that are fetched asynchronously.
 *
 * @typeParam T - The row object type.
 */
export interface IDatasource<T = unknown> {

  /** Returns the total number of items, synchronously or asynchronously. */
  getNumberOfItems(): number | Promise<number>;

  /**
   * Returns the row object at the given index.
   *
   * @param rowIndex - Zero-based index of the row to retrieve.
   * @returns The row value, or a `Promise` that resolves to it.
   */
  getObjectAtRowIndex(rowIndex: number): RowResult<T>;
}

/**
 * A datasource that supports server-side or in-memory sorting.
 *
 * @typeParam T - The row object type.
 */
export interface ISortableDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Applies the given sort expression to the datasource.
   *
   * The expression is a serializable array of `{ columnKey, direction }` objects
   * that can safely cross network boundaries (e.g. to a REST or GraphQL backend).
   *
   * Pass `null` to clear the current sort and restore the original order.
   *
   * @param expression - One or more sort criteria in priority order, or `null` to clear.
   */
  sortBy(expression: SortExpression<T> | null): void;
}

/**
 * A datasource that supports server-side or in-memory filtering.
 *
 * @typeParam T - The row object type.
 */
export interface IFilterableDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Applies the given filter expression to the datasource.
   *
   * The expression is a structured array of property-level or row-level
   * predicates. Pass `null` or `undefined` to clear the filter and
   * restore all rows.
   *
   * @param expression - The filter criteria to apply, or `null`/`undefined` to clear.
   */
  filterBy(expression: CompiledFilter<T> | null | undefined): void;
}

/**
 * A datasource that supports notifying consumers about changes
 * to specific rows or ranges of rows.
 *
 * @typeParam T - The row object type.
 */
export interface IActiveDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Fires when a specific row has changed.
   * The event includes the index of the changed row.
   */
  noteRowChanged?: Emitter<RowChangedNotification>;

  /**
   * Fires when a range of rows has changed.
   * The event includes the definition of the changed range.
   */
  noteRowRangeChanged?: Emitter<RowRangeChangedNotification>;
}

/**
 * Contract for an autocomplete suggestion provider.
 *
 * `completeFor` receives the current query string and the items that
 * are already selected (so the implementation can exclude them) and
 * returns an array of suggestions.
 *
 * @typeParam T - The suggestion item type.
 */
export interface AutocompleteDatasource<T> {
  completeFor(query: string, selection: readonly T[]): T[];
}

// ---------------------------------------------------------------------------
// Tree datasource types
// ---------------------------------------------------------------------------

/**
 * A single node in a hierarchical tree structure.
 *
 * @typeParam T - The data payload type carried by each node.
 */
export interface TreeNode<T = unknown> {

  /** Unique identifier for the node. */
  id: string;

  /** The data payload associated with this node. */
  data: T;

  /** Child nodes. An empty array or `undefined` indicates a leaf node. */
  children?: TreeNode<T>[];

  /**
   * Whether the node starts in an expanded state.
   * Defaults to `false` when omitted.
   */
  expanded?: boolean;

  /** Whether the node is disabled (cannot be selected or toggled). */
  disabled?: boolean;

  /**
   * Optional icon SVG inner content (paths, circles, etc.) rendered
   * via `<ui-icon>`. When omitted, no icon is shown.
   */
  icon?: string;
}

/**
 * Core datasource contract for tree-view.
 *
 * Implementations provide the root nodes and child resolution,
 * following the same philosophy as `IDatasource<T>` for flat data
 * but adapted for hierarchical data.
 *
 * @typeParam T - The data payload type.
 */
export interface ITreeDatasource<T = unknown> {

  /**
   * Returns the root-level nodes of the tree.
   *
   * May return synchronously or as a `Promise` for lazy-loaded trees.
   */
  getRootNodes(): TreeNode<T>[] | Promise<TreeNode<T>[]>;

  /**
   * Returns the children of the given node.
   *
   * The default implementation reads `node.children`. Override this
   * method to support lazy-loading children from a remote source.
   *
   * @param node - The parent node whose children are requested.
   */
  getChildren(node: TreeNode<T>): TreeNode<T>[] | Promise<TreeNode<T>[]>;

  /**
   * Returns `true` if the node has children (or might have children
   * that can be lazy-loaded).
   *
   * The default implementation checks `node.children?.length > 0`.
   */
  hasChildren(node: TreeNode<T>): boolean;
}

/**
 * How the tree-view handles selection.
 *
 * - `'none'`     — No selection.
 * - `'single'`   — Clicking or arrow-keying selects exactly one node.
 * - `'path'`     — Like single, but arrow-key navigation always
 *                  selects the deepest visible child under the
 *                  focused node, keeping an entire ancestor path
 *                  "active".
 * - `'multiple'` — Checkbox-style multi-select (toggle on click/Space).
 */
export type TreeSelectionMode = "none" | "single" | "path" | "multiple";

/**
 * Optional tree filtering capability.
 *
 * Implement this interface alongside `ITreeDatasource` when the datasource supports
 * filtering hierarchical data. This is commonly used by `UIMasterDetailView` in tree mode.
 *
 * @typeParam T - The data payload type.
 */
export interface IFilterableTreeDatasource<
  T = unknown,
> extends ITreeDatasource<T> {

  /**
   * Apply a filter expression to the tree datasource.
   *
   * This should update the internal state to reflect filtered tree structure.
   * Subsequent calls to `getRootNodes()` and `getChildren()` should return filtered data.
   *
   * @param expression - The filter expression to apply.
   */
  filterBy(expression: CompiledFilter<T> | null | undefined): void;
}

/**
 * Optional tree sorting capability.
 *
 * Implement this interface alongside `ITreeDatasource` when the datasource supports
 * sorting hierarchical data at all levels (root nodes and their descendants).
 *
 * @typeParam T - The data payload type.
 */
export interface ISortableTreeDatasource<
  T = unknown,
> extends ITreeDatasource<T> {

  /**
   * Applies a serializable sort expression to the tree datasource.
   *
   * The expression describes which properties of the data payload `T` to sort by.
   * Sorting is applied recursively at all levels (root nodes and all descendants).
   * Subsequent calls to `getRootNodes()` and `getChildren()` should return sorted data.
   *
   * Pass `null` to clear sorting and restore the original insertion order.
   *
   * @param expression - Sort criteria in priority order, or `null` to clear.
   */
  sortBy(expression: SortExpression<T> | null): void;
}

/**
 * A datasource that supports reordering items by index.
 *
 * Implement this interface when the datasource can move an item from one
 * position to another. UI components use the {@link isReorderableDatasource}
 * type guard to detect this capability before calling `moveItem`.
 *
 * @typeParam T - The row object type.
 */
export interface IReorderableDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Moves the item at `fromIndex` to `toIndex`, shifting other items
   * to accommodate.
   *
   * After this call, subsequent calls to `getObjectAtRowIndex()` and
   * `getNumberOfItems()` must reflect the new order.
   *
   * @param fromIndex - The current zero-based index of the item to move.
   * @param toIndex   - The desired zero-based index for the item.
   */
  moveItem(fromIndex: number, toIndex: number): void;
}

/**
 * A datasource that supports inserting items at a given index.
 *
 * Implement this interface when the datasource can accept new items
 * (e.g. as the target of a cross-list drag-and-drop transfer).
 * UI components use the {@link isInsertableDatasource} type guard
 * to detect this capability.
 *
 * @typeParam T - The row object type.
 */
export interface IInsertableDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Inserts `item` at `index`, shifting subsequent items to the right.
   *
   * After this call, `getNumberOfItems()` must return one more than
   * before, and `getObjectAtRowIndex(index)` must return the inserted item.
   *
   * @param index - The zero-based position at which to insert.
   * @param item  - The item to insert.
   */
  insertItem(index: number, item: T): void;
}

/**
 * A datasource that supports removing items by index.
 *
 * Implement this interface when the datasource can give up items
 * (e.g. as the source of a cross-list drag-and-drop transfer).
 * UI components use the {@link isRemovableDatasource} type guard
 * to detect this capability.
 *
 * @typeParam T - The row object type.
 */
export interface IRemovableDatasource<T = unknown> extends IDatasource<T> {

  /**
   * Removes and returns the item at `index`, shifting subsequent items
   * to the left.
   *
   * After this call, `getNumberOfItems()` must return one fewer than
   * before.
   *
   * @param index - The zero-based position of the item to remove.
   * @returns The removed item.
   */
  removeItem(index: number): T;
}
