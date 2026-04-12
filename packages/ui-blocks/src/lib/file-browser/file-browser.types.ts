import { InjectionToken } from "@angular/core";
import type { TreeNode } from "@theredhead/lucid-kit";

/**
 * View modes supported by the file browser contents panel.
 *
 * - `list`   — Default row-per-entry list (original behaviour).
 * - `icons`  — Grid of large icons with name labels.
 * - `detail` — Table with sortable columns (name, size, date, type).
 * - `tree`   — Flat tree view showing nested hierarchy inline.
 * - `column` — NeXTSTEP / macOS Finder column view: one column per
 *              traversed directory level with horizontal scrolling.
 */
export type FileBrowserViewMode =
  | "list"
  | "icons"
  | "detail"
  | "tree"
  | "column";

/**
 * Maps file extensions (without leading dot, lower-case) to SVG icon
 * strings. Consumers provide this via DI to customise the icon view.
 *
 * @example
 * ```ts
 * const MY_ICONS: FileIconRegistry = {
 *   ts:   UIIcons.Lucide.Files.FileCode,
 *   json: UIIcons.Lucide.Files.FileJson,
 *   md:   UIIcons.Lucide.Files.FileText,
 * };
 *
 * providers: [{ provide: FILE_ICON_REGISTRY, useValue: MY_ICONS }]
 * ```
 */
export type FileIconRegistry = Record<string, string>;

/**
 * DI token for the customisable file-icon registry.
 *
 * When provided, the icon view resolves icons by looking up the
 * file's extension (lower-case, without the leading dot) in the
 * registry. Falls back to the default file/folder icon.
 */
export const FILE_ICON_REGISTRY = new InjectionToken<FileIconRegistry>(
  "FILE_ICON_REGISTRY",
);

/**
 * A key-value metadata pair displayed in the details pane.
 */
export interface MetadataField {

  /** Human-readable label for the field. */
  readonly label: string;

  /** Displayable value. */
  readonly value: string | number | boolean;
}

/**
 * Callback that extracts displayable metadata fields from an entry.
 * Provided via the `[metadataProvider]` input on the file browser.
 */
export type MetadataProvider<M = unknown> = (
  entry: FileBrowserEntry<M>,
) => MetadataField[];

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
