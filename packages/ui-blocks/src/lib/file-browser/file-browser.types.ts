import type { TreeNode } from "@theredhead/ui-kit";

/**
 * A single entry in a file browser — either a file or a directory.
 *
 * @typeParam M - Optional metadata type for extra fields
 *               (size, modified date, permissions, etc.).
 */
export interface FileBrowserEntry<M = unknown> {
  /** Unique identifier for the entry. */
  readonly id: string;

  /** Display name of the file or directory. */
  readonly name: string;

  /** Whether this entry is a directory (`true`) or a file (`false`). */
  readonly isDirectory: boolean;

  /**
   * Optional SVG icon override. When omitted, the file browser
   * uses default folder/file icons.
   */
  readonly icon?: string;

  /** Optional arbitrary metadata (size, date, MIME type, etc.). */
  readonly meta?: M;
}

/**
 * Datasource contract for the file browser.
 *
 * Implementations may back this with an in-memory tree, a REST API,
 * IndexedDB, or any other storage mechanism. All methods may return
 * either a synchronous value or a `Promise`.
 *
 * @typeParam M - Optional metadata type carried on each entry.
 */
export interface FileBrowserDatasource<M = unknown> {
  /**
   * Returns the entries (files and directories) inside the given
   * directory node. For the root directory, `parent` is `null`.
   */
  getChildren(
    parent: FileBrowserEntry<M> | null,
  ): FileBrowserEntry<M>[] | Promise<FileBrowserEntry<M>[]>;

  /**
   * Returns `true` if the given entry is a directory that can
   * contain children (even if currently empty).
   */
  isDirectory(entry: FileBrowserEntry<M>): boolean;
}

/**
 * Event emitted when a file (non-directory) entry is activated
 * (double-clicked or pressed Enter).
 *
 * @typeParam M - Optional metadata type.
 */
export interface FileActivateEvent<M = unknown> {
  /** The activated file entry. */
  readonly entry: FileBrowserEntry<M>;

  /** ISO-8601 timestamp of the activation. */
  readonly activatedAt: string;
}

/**
 * Event emitted when the current directory changes (user navigates
 * into a folder).
 *
 * @typeParam M - Optional metadata type.
 */
export interface DirectoryChangeEvent<M = unknown> {
  /** The directory the user navigated to (`null` for root). */
  readonly directory: FileBrowserEntry<M> | null;

  /** The breadcrumb path from root to the current directory. */
  readonly path: readonly FileBrowserEntry<M>[];
}

/**
 * Adapter that converts {@link FileBrowserEntry} items to
 * {@link TreeNode} items for the tree-view sidebar.
 *
 * @internal
 */
export function entryToTreeNode<M>(
  entry: FileBrowserEntry<M>,
  children?: TreeNode<FileBrowserEntry<M>>[],
): TreeNode<FileBrowserEntry<M>> {
  return {
    id: entry.id,
    data: entry,
    children,
    icon: entry.icon,
  };
}
