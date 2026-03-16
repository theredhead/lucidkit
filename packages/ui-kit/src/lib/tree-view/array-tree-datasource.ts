import type { ITreeDatasource, TreeNode } from "./tree-view.types";

/**
 * Simple in-memory tree datasource backed by an array of root nodes.
 *
 * The constructor takes a defensive copy of the root array so that
 * external mutations do not affect the tree. Child nodes are read
 * from a configurable property on each {@link TreeNode}, defaulting
 * to `'children'`.
 *
 * @typeParam T - The data payload type.
 *
 * @example
 * ```ts
 * // Default — reads children from `node.children`
 * const ds = new ArrayTreeDatasource([
 *   { id: '1', data: 'Root', children: [
 *     { id: '1.1', data: 'Child' },
 *   ]},
 * ]);
 *
 * // Custom property — reads children from `node.items`
 * const ds2 = new ArrayTreeDatasource(roots, 'items');
 * ```
 */
export class ArrayTreeDatasource<T = unknown> implements ITreeDatasource<T> {
  private readonly roots: TreeNode<T>[];
  private readonly childrenProperty: keyof TreeNode<T>;

  public constructor(
    roots: TreeNode<T>[],
    childrenProperty: keyof TreeNode<T> = "children",
  ) {
    this.roots = [...roots];
    this.childrenProperty = childrenProperty;
  }

  /** Returns the root-level nodes. */
  public getRootNodes(): TreeNode<T>[] {
    return this.roots;
  }

  /** Returns the children of the given node. */
  public getChildren(node: TreeNode<T>): TreeNode<T>[] {
    return (node[this.childrenProperty] as TreeNode<T>[] | undefined) ?? [];
  }

  /** Returns `true` when the node has at least one child. */
  public hasChildren(node: TreeNode<T>): boolean {
    return this.getChildren(node).length > 0;
  }
}
