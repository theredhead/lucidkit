import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";

import {
  UIBreadcrumb,
  type BreadcrumbItem,
  UITreeView,
  UIIcon,
  UIIcons,
  type TreeNode,
  type ITreeDatasource,
} from "@theredhead/ui-kit";

import { NgTemplateOutlet } from "@angular/common";

import type {
  DirectoryChangeEvent,
  FileActivateEvent,
  FileBrowserDatasource,
  FileBrowserEntry,
  FileBrowserViewMode,
  MetadataField,
  MetadataProvider,
} from "./file-browser.types";
import { entryToTreeNode, FILE_ICON_REGISTRY } from "./file-browser.types";

/**
 * Context provided to a custom entry template.
 *
 * @typeParam M - Metadata type carried on each entry.
 */
export interface EntryTemplateContext<M = unknown> {
  /** The entry (also available as the implicit `let-entry`). */
  $implicit: FileBrowserEntry<M>;
}

/**
 * A two-panel file browser block composing {@link UITreeView},
 * {@link UIBreadcrumb}, and a contents list.
 *
 * The tree sidebar shows the folder hierarchy. Selecting a folder
 * displays its contents (files and sub-folders) in the main panel.
 * A breadcrumb bar shows the current path and allows quick
 * navigation to ancestor folders.
 *
 * ### Basic usage
 * ```html
 * <ui-file-browser [datasource]="ds" (fileActivated)="open($event)" />
 * ```
 *
 * ### With custom entry template
 * ```html
 * <ui-file-browser [datasource]="ds">
 *   <ng-template #entryTemplate let-entry>
 *     <span>{{ entry.name }} — {{ entry.meta?.size }}</span>
 *   </ng-template>
 * </ui-file-browser>
 * ```
 */
@Component({
  selector: "ui-file-browser",
  standalone: true,
  imports: [UITreeView, UIBreadcrumb, UIIcon, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./file-browser.component.html",
  styleUrl: "./file-browser.component.scss",
  host: {
    class: "ui-file-browser",
  },
})
export class UIFileBrowser<M = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** The datasource providing the file/directory structure. */
  public readonly datasource = input.required<FileBrowserDatasource<M>>();

  /** Accessible label for the file browser. */
  public readonly ariaLabel = input<string>("File browser");

  /** Whether to show the sidebar tree panel. */
  public readonly showSidebar = input<boolean>(true);

  /** Label for the root breadcrumb item. */
  public readonly rootLabel = input<string>("Root");

  /** Active view mode for the contents panel. */
  public readonly viewMode = input<FileBrowserViewMode>("list");

  /** Whether to show the details pane for the selected entry. */
  public readonly showDetails = input<boolean>(false);

  /**
   * Callback that extracts metadata fields from a selected entry.
   * Required for the details pane to display meaningful data.
   */
  public readonly metadataProvider = input<MetadataProvider<M> | null>(null);

  // ── Models ────────────────────────────────────────────────────────

  /** The currently selected entry (two-way bindable). */
  public readonly selectedEntry = model<FileBrowserEntry<M> | null>(null);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted when a file (non-directory) is activated (double-click / Enter). */
  public readonly fileActivated = output<FileActivateEvent<M>>();

  /** Emitted when the current directory changes. */
  public readonly directoryChange = output<DirectoryChangeEvent<M>>();

  // ── Content projection ────────────────────────────────────────────

  /** Optional custom template for rendering each entry in the contents panel. */
  public readonly entryTemplate =
    contentChild<TemplateRef<EntryTemplateContext<M>>>("entryTemplate");

  // ── View queries ──────────────────────────────────────────────────

  /** @internal */
  private readonly treeViewRef =
    viewChild<UITreeView<FileBrowserEntry<M>>>("treeView");

  // ── Internal state ────────────────────────────────────────────────

  /** @internal — the breadcrumb path from root to the current directory. */
  protected readonly path = signal<readonly FileBrowserEntry<M>[]>([]);

  /** @internal — the current directory (`null` = root). */
  protected readonly currentDirectory = signal<FileBrowserEntry<M> | null>(
    null,
  );

  /** @internal — contents of the current directory. */
  protected readonly contents = signal<readonly FileBrowserEntry<M>[]>([]);

  /** @internal — tree selection for one-way binding. */
  protected readonly treeSelected = signal<
    readonly TreeNode<FileBrowserEntry<M>>[]
  >([]);

  /** @internal — tree datasource adapter. */
  protected readonly treeDatasource = computed<
    ITreeDatasource<FileBrowserEntry<M>>
  >(() => {
    const ds = this.datasource();
    return this.createTreeDatasource(ds);
  });

  /** @internal — display function for tree nodes. */
  protected readonly displayNodeLabel = (entry: FileBrowserEntry<M>): string =>
    entry.name;

  // ── Icons ─────────────────────────────────────────────────────────

  /** @internal */
  protected readonly icons = {
    folder: UIIcons.Lucide.Files.Folder,
    folderOpen: UIIcons.Lucide.Files.FolderOpen,
    file: UIIcons.Lucide.Files.File,
    fileText: UIIcons.Lucide.Files.FileText,
    chevronRight: UIIcons.Lucide.Arrows.ChevronRight,
  } as const;

  // ── DI ────────────────────────────────────────────────────────────

  /** @internal — optional icon registry supplied via DI. */
  private readonly iconRegistry = inject(FILE_ICON_REGISTRY, {
    optional: true,
  });

  // ── Column-view state ─────────────────────────────────────────────

  /**
   * @internal — each element represents one column in the column view.
   * Index 0 = root, subsequent = each directory navigated into.
   */
  protected readonly columnPanes = signal<
    readonly {
      directory: FileBrowserEntry<M> | null;
      entries: readonly FileBrowserEntry<M>[];
    }[]
  >([]);

  /**
   * @internal — the entry selected in each column pane (by pane index).
   */
  protected readonly columnSelections = signal<
    readonly (FileBrowserEntry<M> | null)[]
  >([]);

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — breadcrumb items built from the current path. */
  protected readonly breadcrumbItems = computed<readonly BreadcrumbItem[]>(
    () => {
      const items: BreadcrumbItem[] = [{ label: this.rootLabel() }];
      for (const entry of this.path()) {
        items.push({ label: entry.name });
      }
      return items;
    },
  );

  /** @internal — whether an entry is selected in the contents panel. */
  protected readonly hasSelection = computed(
    () => this.selectedEntry() !== null,
  );

  /** @internal — metadata fields for the selected entry (details pane). */
  protected readonly detailFields = computed<readonly MetadataField[]>(() => {
    const entry = this.selectedEntry();
    const provider = this.metadataProvider();
    if (!entry || !provider) return [];
    return provider(entry);
  });

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Load root contents on init
    effect(() => {
      const ds = this.datasource();
      this.loadContents(ds, null);
    });

    // Initialise column-view root pane when datasource is ready
    effect(() => {
      const ds = this.datasource();
      const mode = this.viewMode();
      if (mode === "column") {
        this.initColumnView(ds);
      }
    });
  }

  // ── Public methods ────────────────────────────────────────────────

  /** Navigate to the root directory. */
  public navigateToRoot(): void {
    this.navigateTo(null, []);
  }

  /** Navigate to a specific directory entry. */
  public navigateToDirectory(entry: FileBrowserEntry<M>): void {
    if (!entry.isDirectory) return;
    const newPath = [...this.path(), entry];
    this.navigateTo(entry, newPath);
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal */
  protected onBreadcrumbClick(item: BreadcrumbItem): void {
    const items = this.breadcrumbItems();
    const idx = items.indexOf(item);

    if (idx === 0) {
      // Root
      this.navigateTo(null, []);
    } else {
      // Navigate to that ancestor
      const newPath = this.path().slice(0, idx);
      const target = newPath[newPath.length - 1] ?? null;
      this.navigateTo(target, [...newPath]);
    }
  }

  /** @internal */
  protected onTreeNodeSelected(
    selected: readonly TreeNode<FileBrowserEntry<M>>[],
  ): void {
    if (selected.length === 0) return;
    const node = selected[0];
    const entry = node.data;
    if (entry.isDirectory) {
      const newPath = this.buildPathToNode(node);
      this.navigateTo(entry, newPath);
    }
  }

  /** @internal */
  protected onTreeNodeActivated(node: TreeNode<FileBrowserEntry<M>>): void {
    const entry = node.data;
    if (entry.isDirectory) {
      const newPath = this.buildPathToNode(node);
      this.navigateTo(entry, newPath);
    }
  }

  /** @internal */
  protected onEntryClick(entry: FileBrowserEntry<M>): void {
    this.selectedEntry.set(entry);
  }

  /** @internal */
  protected onEntryDblClick(entry: FileBrowserEntry<M>): void {
    if (entry.isDirectory) {
      this.navigateToDirectory(entry);
    } else {
      this.fileActivated.emit({
        entry,
        activatedAt: new Date().toISOString(),
      });
    }
  }

  /** @internal */
  protected onEntryKeydown(
    event: KeyboardEvent,
    entry: FileBrowserEntry<M>,
  ): void {
    if (event.key === "Enter") {
      event.preventDefault();
      this.onEntryDblClick(entry);
    }
  }

  /** @internal */
  protected getEntryIcon(entry: FileBrowserEntry<M>): string {
    if (entry.icon) return entry.icon;
    if (entry.isDirectory) return this.icons.folder;
    // Check DI icon registry by file extension
    if (this.iconRegistry) {
      const ext = this.extractExtension(entry.name);
      if (ext && ext in this.iconRegistry) {
        return this.iconRegistry[ext];
      }
    }
    return this.icons.file;
  }

  /** @internal */
  protected isEntrySelected(entry: FileBrowserEntry<M>): boolean {
    return this.selectedEntry()?.id === entry.id;
  }

  // ── Private methods ───────────────────────────────────────────────

  private navigateTo(
    directory: FileBrowserEntry<M> | null,
    path: readonly FileBrowserEntry<M>[],
  ): void {
    this.currentDirectory.set(directory);
    this.path.set(path);
    this.selectedEntry.set(null);
    this.loadContents(this.datasource(), directory);
    this.directoryChange.emit({ directory, path });

    // Expand the tree to the selected folder
    this.expandTreeToPath(path);
  }

  private async loadContents(
    ds: FileBrowserDatasource<M>,
    parent: FileBrowserEntry<M> | null,
  ): Promise<void> {
    const result = await Promise.resolve(ds.getChildren(parent));
    this.contents.set(result);
  }

  private createTreeDatasource(
    ds: FileBrowserDatasource<M>,
  ): ITreeDatasource<FileBrowserEntry<M>> {
    return {
      getRootNodes: () => {
        const children = ds.getChildren(null);
        if (children instanceof Promise) {
          return children.then((items) =>
            items.filter((e) => e.isDirectory).map((e) => entryToTreeNode(e)),
          );
        }
        return children
          .filter((e) => e.isDirectory)
          .map((e) => entryToTreeNode(e));
      },
      getChildren: (node: TreeNode<FileBrowserEntry<M>>) => {
        const children = ds.getChildren(node.data);
        if (children instanceof Promise) {
          return children.then((items) =>
            items.filter((e) => e.isDirectory).map((e) => entryToTreeNode(e)),
          );
        }
        return children
          .filter((e) => e.isDirectory)
          .map((e) => entryToTreeNode(e));
      },
      hasChildren: (node: TreeNode<FileBrowserEntry<M>>) =>
        ds.isDirectory(node.data),
    };
  }

  private buildPathToNode(
    node: TreeNode<FileBrowserEntry<M>>,
  ): FileBrowserEntry<M>[] {
    // Walk the tree from roots to find the path to this node
    const ds = this.treeDatasource();
    const roots = ds.getRootNodes();
    if (!Array.isArray(roots)) return [node.data];

    const path: FileBrowserEntry<M>[] = [];
    const found = this.findNodePath(roots, node.id, path, ds);
    return found ? path : [node.data];
  }

  private findNodePath(
    nodes: TreeNode<FileBrowserEntry<M>>[],
    targetId: string,
    path: FileBrowserEntry<M>[],
    ds: ITreeDatasource<FileBrowserEntry<M>>,
  ): boolean {
    for (const n of nodes) {
      path.push(n.data);
      if (n.id === targetId) return true;

      if (ds.hasChildren(n)) {
        const children = ds.getChildren(n);
        if (
          Array.isArray(children) &&
          this.findNodePath(children, targetId, path, ds)
        ) {
          return true;
        }
      }
      path.pop();
    }
    return false;
  }

  private expandTreeToPath(path: readonly FileBrowserEntry<M>[]): void {
    const tree = this.treeViewRef();
    if (!tree) return;
    for (const entry of path) {
      const node = entryToTreeNode(entry);
      tree.expand(node);
    }
  }

  // ── Column-view helpers ───────────────────────────────────────────

  /** @internal — handle click on an entry inside a column pane. */
  protected async onColumnEntryClick(
    paneIndex: number,
    entry: FileBrowserEntry<M>,
  ): Promise<void> {
    // Update selection in this pane
    const sels = [...this.columnSelections()];
    sels[paneIndex] = entry;
    // Clear selections in deeper panes
    this.columnSelections.set(sels.slice(0, paneIndex + 1));
    this.selectedEntry.set(entry);

    // If directory, open a new pane to the right (truncate deeper panes first)
    if (entry.isDirectory) {
      const ds = this.datasource();
      const children = await Promise.resolve(ds.getChildren(entry));
      const panes = this.columnPanes().slice(0, paneIndex + 1);
      this.columnPanes.set([...panes, { directory: entry, entries: children }]);
    } else {
      // Truncate deeper panes for file selection
      this.columnPanes.set(this.columnPanes().slice(0, paneIndex + 1));
    }
  }

  /** @internal — double-click in column view activates a file. */
  protected onColumnEntryDblClick(entry: FileBrowserEntry<M>): void {
    if (!entry.isDirectory) {
      this.fileActivated.emit({
        entry,
        activatedAt: new Date().toISOString(),
      });
    }
  }

  /** @internal — check if entry is selected in a column pane. */
  protected isColumnEntrySelected(
    paneIndex: number,
    entry: FileBrowserEntry<M>,
  ): boolean {
    return this.columnSelections()[paneIndex]?.id === entry.id;
  }

  private async initColumnView(ds: FileBrowserDatasource<M>): Promise<void> {
    const rootEntries = await Promise.resolve(ds.getChildren(null));
    this.columnPanes.set([{ directory: null, entries: rootEntries }]);
    this.columnSelections.set([]);
  }

  private extractExtension(filename: string): string | null {
    const dot = filename.lastIndexOf(".");
    if (dot < 1) return null;
    return filename.slice(dot + 1).toLowerCase();
  }
}
