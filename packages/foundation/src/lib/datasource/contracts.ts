/**
 * @theredhead/foundation — Datasource Contracts
 *
 * Base datasource contracts and optional capability interfaces for data-displaying UI controls.
 * See DATASOURCE-ARCHITECTURE.md for full design documentation.
 */

/**
 * Minimal read-only datasource contract for UI consumers.
 *
 * Implementations only need to provide row count and row-by-index access.
 * Additional behavior (filtering, sorting, paging) is provided via opt-in capability interfaces.
 *
 * @template T The type of items in the datasource.
 *
 * @example
 * ```ts
 * class SimpleArrayDataSource<T> implements IDataSource<T> {
 *   constructor(private items: T[]) {}
 *
 *   public getNumberOfItems(): number {
 *     return this.items.length;
 *   }
 *
 *   public getObjectAtRowIndex(index: number): T {
 *     return this.items[index];
 *   }
 * }
 * ```
 */
export interface IDataSource<T> {
  /**
   * Get the total number of items in the datasource.
   *
   * @returns Number of items, or a Promise if async.
   */
  getNumberOfItems(): number | Promise<number>;

  /**
   * Get the item at a specific row index.
   *
   * @param index Zero-based row index.
   * @returns The item at that index, or a Promise if async.
   * @throws If index is out of bounds.
   */
  getObjectAtRowIndex(index: number): T | Promise<T>;
}

/**
 * Optional paging capability for datasources that support page-based navigation.
 *
 * Implement this interface alongside `IDataSource` when the datasource supports pagination.
 *
 * @example
 * ```ts
 * class PageableArrayDataSource<T>
 *   implements IDataSource<T>, IPageableDataSource {
 *   private pageIndex = 0;
 *   private pageSize = 10;
 *
 *   public getPageIndex(): number { return this.pageIndex; }
 *   public setPageIndex(index: number): void { this.pageIndex = index; }
 *   public getPageSize(): number { return this.pageSize; }
 *   public setPageSize(size: number): void { this.pageSize = size; }
 *
 *   public getNumberOfItems(): number { ... }
 *   public getObjectAtRowIndex(index: number): T { ... }
 * }
 * ```
 */
export interface IPageableDataSource {
  /**
   * Get the current page index (0-based).
   */
  getPageIndex(): number;

  /**
   * Set the current page index. Should trigger a datasource update.
   */
  setPageIndex(index: number): void;

  /**
   * Get the number of items per page.
   */
  getPageSize(): number;

  /**
   * Set the number of items per page. Should trigger a datasource update.
   */
  setPageSize(size: number): void;
}

/**
 * Optional filtering capability for datasources.
 *
 * Implement this interface alongside `IDataSource` when the datasource supports filtering.
 * UI components should use type guards to detect this capability before calling it.
 *
 * @template _T The type of items being filtered.
 *
 * @example
 * ```ts
 * class FilterableArrayDataSource<T>
 *   implements IDataSource<T>, IFilterableDataSource<T> {
 *   private items: T[] = [];
 *   private filteredItems: T[] = [];
 *
 *   public filterBy(expression: FilterExpression<T>): void {
 *     this.filteredItems = this.items.filter(item =>
 *       expression.evaluate(item)
 *     );
 *   }
 *
 *   public getNumberOfItems(): number {
 *     return this.filteredItems.length;
 *   }
 *
 *   public getObjectAtRowIndex(index: number): T {
 *     return this.filteredItems[index];
 *   }
 * }
 * ```
 */
export interface IFilterableDataSource<_T> {
  /**
   * Apply a filter expression to the datasource.
   *
   * This should update the internal state to reflect the filtered result.
   * Subsequent calls to `getNumberOfItems()` and `getObjectAtRowIndex()` should
   * return filtered data.
   *
   * @param expression The filter expression to apply.
   */
  filterBy(expression: unknown): void; // TODO: Replace `unknown` with FilterExpression<_T> once available from foundation
}

/**
 * Optional sorting capability for datasources.
 *
 * Implement this interface alongside `IDataSource` when the datasource supports sorting.
 * UI components should use type guards to detect this capability before calling it.
 *
 * @template _T The type of items being sorted.
 *
 * @example
 * ```ts
 * class SortableArrayDataSource<T>
 *   implements IDataSource<T>, ISortableDataSource<T> {
 *   private items: T[] = [];
 *   private sortedItems: T[] = [];
 *
 *   public sortBy(expression: SortExpression<T>): void {
 *     this.sortedItems = [...this.items].sort((a, b) =>
 *       expression.compare(a, b)
 *     );
 *   }
 *
 *   public getNumberOfItems(): number {
 *     return this.sortedItems.length;
 *   }
 *
 *   public getObjectAtRowIndex(index: number): T {
 *     return this.sortedItems[index];
 *   }
 * }
 * ```
 */
export interface ISortableDataSource<_T> {
  /**
   * Apply a sort expression to the datasource.
   *
   * This should update the internal state to reflect the sorted result.
   * Subsequent calls to `getNumberOfItems()` and `getObjectAtRowIndex()` should
   * return sorted data.
   *
   * @param expression The sort expression to apply.
   */
  sortBy(expression: unknown): void; // TODO: Replace `unknown` with SortExpression<_T> once available from foundation
}

/**
 * Optional tree behavior for hierarchical datasources.
 *
 * Implement this interface when the datasource represents a tree structure.
 * Use with tree-based UI controls like `UITreeView` and `UIMasterDetailView` (tree mode).
 *
 * @template _T The type of items in the tree.
 *
 * @example
 * ```ts
 * interface TreeNode<T> {
 *   id: string;
 *   data: T;
 *   expanded?: boolean;
 *   children?: TreeNode<T>[];
 * }
 *
 * class ArrayTreeDataSource<T> implements ITreeDataSource<T> {
 *   constructor(private roots: TreeNode<T>[]) {}
 *
 *   public getRootNodes(): TreeNode<T>[] {
 *     return this.roots;
 *   }
 *
 *   public getChildren(node: TreeNode<T>): TreeNode<T>[] {
 *     return node.children ?? [];
 *   }
 *
 *   public hasChildren(node: TreeNode<T>): boolean {
 *     return (node.children?.length ?? 0) > 0;
 *   }
 * }
 * ```
 */
export interface ITreeDataSource<_T> {
  /**
   * Get the root nodes of the tree.
   *
   * @returns Array of root nodes, or a Promise if async.
   */
  getRootNodes(): unknown[] | Promise<unknown[]>; // TODO: Replace `unknown[]` with TreeNode<_T>[]

  /**
   * Get the children of a specific tree node.
   *
   * @param node The parent node.
   * @returns Array of child nodes, or a Promise if async.
   */
  getChildren(node: unknown): unknown[] | Promise<unknown[]>; // TODO: Replace `unknown` with TreeNode<_T>

  /**
   * Check if a node has children (for rendering expand indicators).
   *
   * @param node The node to check.
   * @returns True if the node has children; false otherwise.
   */
  hasChildren(node: unknown): boolean; // TODO: Replace `unknown` with TreeNode<_T>
}

/**
 * Optional tree filtering capability.
 *
 * Implement this interface alongside `ITreeDataSource` when the datasource supports
 * filtering hierarchical data. This is commonly used by `UIMasterDetailView` in tree mode.
 *
 * @template _T The type of items in the tree.
 *
 * @example
 * ```ts
 * class FilterableArrayTreeDataSource<T>
 *   extends ArrayTreeDataSource<T>
 *   implements IFilterableTreeDataSource<T> {
 *   public filterBy(expression: FilterExpression<T>): void {
 *     // Apply filter to tree; update internal state
 *   }
 * }
 * ```
 */
export interface IFilterableTreeDataSource<_T> extends ITreeDataSource<_T> {
  /**
   * Apply a filter expression to the tree datasource.
   *
   * This should update the internal state to reflect filtered tree structure.
   * Subsequent calls to `getRootNodes()` and `getChildren()` should return filtered data.
   *
   * @param expression The filter expression to apply.
   */
  filterBy(expression: unknown): void; // TODO: Replace `unknown` with FilterExpression<_T> once available from foundation
}
