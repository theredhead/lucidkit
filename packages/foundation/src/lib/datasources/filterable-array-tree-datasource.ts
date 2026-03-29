import type { Predicate } from "@angular/core";

import type { FilterExpression } from "../types/filter";
import type { IFilterableTreeDatasource, TreeNode } from "./datasource";
import { ArrayTreeDatasource } from "./array-tree-datasource";

/**
 * An in-memory tree datasource that supports filtering via a
 * {@link FilterExpression}.
 *
 * When an expression is applied the datasource compiles it into a
 * single predicate, re-derives its visible tree structure from the
 * original data, and exposes only the matching nodes (plus their
 * ancestors). The underlying tree is never mutated.
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
 * ds.filterBy([{ predicate: node => String(node).includes('A') }]);
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
   * Applies a structured {@link FilterExpression} to the tree.
   *
   * The expression is compiled into a single predicate once, which is
   * then applied to each node's `data`. Matching nodes and their
   * ancestors are kept. Pass an empty array (or `null` / `undefined`)
   * to clear the filter and show all nodes.
   *
   * - **Property-level** entries test a single property of `T`.
   * - **Row-level** entries test the entire `T` object.
   * - All entries must pass (AND) for a node to be included.
   */
  public filterBy(expression: FilterExpression<T> | null | undefined): void {
    if (!expression || expression.length === 0) {
      this._filteredRoots = this.deepCopyNodes(
        this._allRoots,
        this._childrenProperty,
      );
      return;
    }

    const predicate = this.compileExpression(expression);
    this._filteredRoots = this.filterNodes(
      this._allRoots,
      predicate,
      this._childrenProperty,
    );
  }

  /** Clears any active filter, restoring all nodes. */
  public clearFilter(): void {
    this._filteredRoots = this.deepCopyNodes(
      this._allRoots,
      this._childrenProperty,
    );
  }

  // ── Private helpers ───────────────────────────────────────────────

  /**
   * Compiles a {@link FilterExpression} into a single predicate
   * function that can be applied to each node's `data`.
   */
  private compileExpression(expression: FilterExpression<T>): Predicate<T> {
    const tests = expression.map((entry) => {
      if ("property" in entry) {
        const { property, predicate } = entry;
        return (data: T) => predicate(data[property]);
      }
      const { predicate } = entry;
      return (data: T) => predicate(data);
    });

    return (data: T) => tests.every((test) => test(data));
  }

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
   * Create a structural copy of tree nodes to avoid mutations to the
   * original tree shape. Each {@link TreeNode} wrapper is shallow-copied
   * (`{ ...node }`) so the `data` payload remains a shared reference.
   * This is intentional — deep-cloning arbitrary `T` is not feasible.
   *
   * @param nodes - The nodes to copy.
   * @param childrenProp - The property name for children.
   * @returns Structurally-copied node tree (shared `data` references).
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
