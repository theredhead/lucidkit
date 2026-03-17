import type { FilterExpression } from "../types/filter";
import type {
  RowChangedNotification,
  RowRangeChangedNotification,
} from "../types/notifications";
import type { SortExpression } from "../types/sort";
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
   * @param expression - One or more sort criteria in priority order.
   */
  sortBy(expression: SortExpression<T>): void;
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
   * @param expression - The filter criteria to apply.
   */
  filterBy(expression: FilterExpression<T>): void;
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
