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
 * A single allowed-type entry used by {@link AllowedFileTypes}.
 *
 * - `extension` — matches by lower-case file extension (no leading dot).
 * - `mime`      — matches by MIME type string; the subtype may be `*`
 *                 for wildcard matching (e.g. `image/*`).
 */
export type AllowedFileType =
  | { readonly kind: "extension"; readonly value: string }
  | { readonly kind: "mime"; readonly value: string };

/**
 * Parsed representation of an allowed-types mask.
 *
 * Build one from a comma-separated string (the HTML `<input accept>` format)
 * using {@link parseAllowedTypes}, or construct it directly.
 *
 * @example
 * ```ts
 * const types = parseAllowedTypes(".ts, .tsx, image/*, application/json");
 * types.matches("photo.png", "image/png"); // true
 * types.matches("README.md");              // false
 * ```
 */
export interface AllowedFileTypes {
  /** The individual type rules that make up this mask. */
  readonly entries: readonly AllowedFileType[];

  /**
   * Returns `true` if the given filename (and optional MIME type) is
   * permitted by at least one rule. Directories always return `true`.
   *
   * @param name     - The file name (used for extension matching).
   * @param mimeType - Optional MIME type string (used for mime rules).
   */
  matches(name: string, mimeType?: string): boolean;
}

/**
 * Parses a comma-separated allowed-types mask into an {@link AllowedFileTypes}
 * object.
 *
 * The format mirrors the HTML `<input accept>` attribute:
 * - `.ext`        — file extension (case-insensitive, leading dot optional)
 * - `type/subtype`— exact MIME type, e.g. `application/json`
 * - `type/*`      — MIME wildcard, e.g. `image/*`
 *
 * @example
 * ```ts
 * const types = parseAllowedTypes(".ts, .tsx, image/*");
 * ```
 */
export function parseAllowedTypes(mask: string): AllowedFileTypes {
  const entries: AllowedFileType[] = mask
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0)
    .map((t): AllowedFileType => {
      if (t.includes("/")) {
        return { kind: "mime", value: t };
      }
      // Strip leading dot — store extension without it
      return { kind: "extension", value: t.startsWith(".") ? t.slice(1) : t };
    });

  return {
    entries,
    matches(name: string, mimeType?: string): boolean {
      if (entries.length === 0) return true;
      return entries.some((e) => {
        if (e.kind === "extension") {
          const dot = name.lastIndexOf(".");
          const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
          return ext === e.value;
        }
        // MIME matching
        if (!mimeType) return false;
        const [eType, eSubtype] = e.value.split("/");
        const [mType, mSubtype] = mimeType.toLowerCase().split("/");
        if (eType !== mType) return false;
        return eSubtype === "*" || eSubtype === mSubtype;
      });
    },
  };
}

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

  /**
   * Optional MIME type for the entry (e.g. `"image/png"`).
   * Used by {@link AllowedFileTypes} for MIME-based filtering.
   */
  readonly mimeType?: string;

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
 * Well-known storage keys for common file-browser use cases.
 *
 * Pass one of these as `[name]` to share preferences across all instances
 * that serve the same purpose:
 *
 * ```html
 * <ui-file-browser [datasource]="ds" [name]="UIFileBrowserKeys.OpenFile" />
 * ```
 *
 * `Global` is used automatically when no `[name]` is supplied; you do not
 * normally need to reference it directly.
 *
 * Library users may pass any plain string as `[name]` to create their own
 * isolated preference scope.
 */
export const UIFileBrowserKeys = {
  /** Shared key used when no explicit `[name]` is provided. */
  Global: "__global__",

  /**
   * Conventional key for open-file dialogs. Use
   * `[name]="UIFileBrowserKeys.OpenFile"` to opt in.
   */
  OpenFile: "open-file",

  /**
   * Conventional key for save-file dialogs. Use
   * `[name]="UIFileBrowserKeys.SaveFile"` to opt in.
   */
  SaveFile: "save-file",
} as const;

/**
 * Settings persisted per storage key.
 *
 * All fields are optional so partial data round-trips safely.
 * Panel-width fields are only written for named instances.
 */
export interface FileBrowserPersistedSettings {
  /** Last active view mode chosen by the user. */
  readonly viewMode?: FileBrowserViewMode;

  /** Whether the details pane was open. */
  readonly showDetails?: boolean;

  /** Sidebar panel width in pixels. */
  readonly sidebarWidth?: number;

  /** Details panel width in pixels. */
  readonly detailsWidth?: number;

  /** Whether the sidebar was collapsed. */
  readonly sidebarCollapsed?: boolean;

  /** Whether the details panel was collapsed. */
  readonly detailsCollapsed?: boolean;
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
