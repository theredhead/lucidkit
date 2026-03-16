// ---------------------------------------------------------------------------
// Tree-view types
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

// ---------------------------------------------------------------------------
// Datasource contract
// ---------------------------------------------------------------------------

/**
 * Core datasource contract for tree-view.
 *
 * Implementations provide the root nodes and child resolution,
 * following the same philosophy as `IDatasource<T>` for table-view
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

/** How the tree-view handles selection. */
export type TreeSelectionMode = "none" | "single" | "multiple";
