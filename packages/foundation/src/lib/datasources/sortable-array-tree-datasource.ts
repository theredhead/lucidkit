import type { ISortableTreeDatasource, TreeNode } from "./datasource";
import { ArrayTreeDatasource } from "./array-tree-datasource";

/**
 * An in-memory tree datasource that supports sorting via a comparator function.
 *
 * When a comparator is applied, the datasource re-derives its visible tree
 * structure from the original data. Nodes are sorted at each level of the tree
 * (root nodes and all children recursively). The underlying tree is never mutated.
 *
 * @typeParam T - The data payload type.
 *
 * @example
 * ```ts
 * const ds = new SortableArrayTreeDatasource([
 *   { id: '1', data: { name: 'Beta' }, children: [
 *     { id: '1.1', data: { name: 'Zebra' } },
 *     { id: '1.2', data: { name: 'Apple' } },
 *   ]},
 * ]);
 *
 * // Sort all levels alphabetically by data.name
 * ds.applyComparator((a, b) => a.data.name.localeCompare(b.data.name));
 * ```
 */
export class SortableArrayTreeDatasource<T = unknown>
  extends ArrayTreeDatasource<T>
  implements ISortableTreeDatasource<T>
{
  /** The full, unsorted tree. */
  private readonly _allRoots: TreeNode<T>[];

  /** The currently sorted tree. */
  private _sortedRoots: TreeNode<T>[];

  /** The children property key for accessing child arrays. */
  private readonly childrenProperty: keyof TreeNode<T>;

  /**
   * The full, unsorted root nodes.
   *
   * Useful when consumers need to inspect the original tree structure
   * while a sort is active.
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
    this._sortedRoots = [...this._allRoots];
    this.childrenProperty = childrenProperty;
  }

  // ── ITreeDatasource overrides ─────────────────────────────────────

  public override getRootNodes(): TreeNode<T>[] {
    return this._sortedRoots;
  }

  // ── ISortableTreeDatasource ──────────────────────────────────────

  /**
   * Applies a comparator function to sort the tree at all levels.
   *
   * The comparator is applied recursively to root nodes and all descendants.
   * Pass `null` or `undefined` to clear the sort and restore the original
   * insertion order.
   *
   * @param comparator - The comparator function, or null/undefined to clear sorting.
   */
  public applyComparator(
    comparator: ((a: TreeNode<T>, b: TreeNode<T>) => number) | null | undefined,
  ): void {
    if (!comparator) {
      this._sortedRoots = this.deepCopyNodes(this._allRoots, this.childrenProperty);
      return;
    }

    this._sortedRoots = this.sortNodes(
      this._allRoots,
      comparator,
      this.childrenProperty,
    );
  }

  // ── Private helpers ──────────────────────────────────────────────

  /**
   * Deep copy an array of tree nodes.
   *
   * @internal
   */
  private deepCopyNodes(
    nodes: TreeNode<T>[],
    childrenProp: keyof TreeNode<T>,
  ): TreeNode<T>[] {
    return nodes.map((node) => {
      const copy = { ...node };
      const children = (node[childrenProp] as TreeNode<T>[] | undefined) ?? [];
      if (children.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (copy[childrenProp] as any) = this.deepCopyNodes(children, childrenProp);
      }
      return copy;
    });
  }

  /**
   * Recursively sort tree nodes and their children.
   *
   * @internal
   */
  private sortNodes(
    nodes: TreeNode<T>[],
    comparator: (a: TreeNode<T>, b: TreeNode<T>) => number,
    childrenProp: keyof TreeNode<T>,
  ): TreeNode<T>[] {
    const result: TreeNode<T>[] = [];

    for (const node of nodes) {
      const copy = { ...node };
      const children = (node[childrenProp] as TreeNode<T>[] | undefined) ?? [];

      // Recursively sort children
      if (children.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (copy[childrenProp] as any) = this.sortNodes(
          children,
          comparator,
          childrenProp,
        );
      }

      result.push(copy);
    }

    // Sort at this level
    return result.sort(comparator);
  }
}
