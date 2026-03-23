import type { Predicate } from "@angular/core";

import type { IFilterableTreeDatasource, TreeNode } from "./datasource";
import { ArrayTreeDatasource } from "./array-tree-datasource";

/**
 * An in-memory tree datasource that supports filtering via a `Predicate<T>`.
 *
 * When a predicate is applied, the datasource re-derives its visible tree
 * structure from the original data. Nodes that don't match the predicate
 * are excluded, along with their descendants. The underlying tree is never mutated.
 *
 * @typeParam T - The data payload type.
 *
 * @example
 * ```ts
 * const ds = new FilterableArrayTreeDatasource([
 *   { id: '1', data: 'Root', children: [
 *     { id: '1.1', data: 'Child A' },
 *     { id: '1.2', data: 'Child B' },
 *   ]},
 * ]);
 *
 * // Show only nodes containing 'A' in their data
 * ds.filterBy(node => String(node.data).includes('A'));
 * ```
 */
export class FilterableArrayTreeDatasource<T = unknown>
  extends ArrayTreeDatasource<T>
  implements IFilterableTreeDatasource<T>
{
  /** The full, unfiltered tree. */
  private readonly _allRoots: TreeNode<T>[];

  /** The currently filtered tree. */
  private _filteredRoots: TreeNode<T>[];

  /** Cached children property key for accessing child arrays. */
  private readonly _childrenProperty: keyof TreeNode<T>;

  /**
   * The full, unfiltered root nodes.
   *
   * Useful when consumers need to inspect the original tree structure
   * while a filter is active.
   */
  public get allRoots(): TreeNode<T>[] {
    return this._allRoots;
  }

  public constructor(
    roots: TreeNode<T>[],
    childrenProperty: keyof TreeNode<T> = "children",
  ) {
    super(roots, childrenProperty);
    this._allRoots = this.deepCopyNodes(roots, childrenProperty);
    this._filteredRoots = [...this._allRoots];
    this._childrenProperty = childrenProperty;
  }

  // ── ITreeDatasource overrides ─────────────────────────────────────

  public override getRootNodes(): TreeNode<T>[] {
    return this._filteredRoots;
  }

  // ── IFilterableTreeDataSource ────────────────────────────────────

  /**
   * Apply a filter predicate to the tree.
   *
   * Nodes that match are kept, along with ancestors that lead to
   * matching descendants. Pass `null` or `undefined` to clear the
   * filter and show all nodes.
   *
   * @param predicate - The predicate function, or null/undefined to clear filtering.
   */
  public filterBy(predicate: Predicate<T> | null | undefined): void {
    if (!predicate) {
      this._filteredRoots = this.deepCopyNodes(
        this._allRoots,
        this._childrenProperty,
      );
      return;
    }

    this._filteredRoots = this.filterNodes(
      this._allRoots,
      predicate,
      this._childrenProperty,
    );
  }

  // ── Private helpers ───────────────────────────────────────────────

  /**
   * Recursively filter tree nodes, excluding non-matching nodes and
   * their descendants.
   *
   * A node is kept if:
   * - The node itself matches the predicate, OR
   * - At least one of its descendants matches the predicate
   *
   * @param nodes - The nodes to filter.
   * @param predicate - The predicate function.
   * @param childrenProp - The property name for children.
   * @returns Filtered node tree.
   */
  private filterNodes(
    nodes: TreeNode<T>[],
    predicate: Predicate<T>,
    childrenProp: keyof TreeNode<T>,
  ): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];

    for (const node of nodes) {
      const children = (node[childrenProp] as TreeNode<T>[] | undefined) ?? [];
      const filteredChildren = this.filterNodes(
        children,
        predicate,
        childrenProp,
      );
      const nodeMatches = predicate(node.data);

      // Keep node if it matches OR if any descendant matches
      if (nodeMatches || filteredChildren.length > 0) {
        const copy = { ...node };
        // Always use filtered children (even if empty) to reflect the filter result
        if (children.length > 0) {
          (copy as Record<string, unknown>)[childrenProp] = filteredChildren;
        }
        result.push(copy);
      }
    }

    return result;
  }

  /**
   * Create a deep copy of tree nodes to avoid mutations to the original.
   *
   * @param nodes - The nodes to copy.
   * @param childrenProp - The property name for children.
   * @returns Deep-copied node tree.
   */
  private deepCopyNodes(
    nodes: TreeNode<T>[],
    childrenProp: keyof TreeNode<T>,
  ): TreeNode<T>[] {
    return nodes.map((node) => {
      const copy = { ...node };
      const children = (node[childrenProp] as TreeNode<T>[] | undefined) ?? [];
      if (children.length > 0) {
        (copy as Record<string, unknown>)[childrenProp] = this.deepCopyNodes(
          children,
          childrenProp,
        );
      }
      return copy;
    });
  }
}
