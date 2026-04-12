import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  FilterableArrayDatasource,
  type IDatasource,
  UISurface,
} from "@theredhead/lucid-foundation";
import {
  UIButton,
  UIDialog,
  UIDialogBody,
  UIDialogFooter,
  UIDialogHeader,
  UIFilter,
  UIIcon,
  UIIcons,
  UIInput,
  UIPagination,
  UITableView,
  UITableViewColumn,
  inferFilterFields,
  toFilterExpression,
  type ColumnMeta,
  type FilterDescriptor,
  type FilterExpression,
  type FilterFieldDefinition,
  type PageChangeEvent,
} from "@theredhead/lucid-kit";

import { SavedSearchService } from "./saved-search.service";
import type { SavedSearch } from "./saved-search.types";
import type {
  SearchViewLayout,
  SearchViewResultsContext,
} from "./search-view.types";

/**
 * A unified browse-and-filter layout that composes {@link UIFilter},
 * {@link UITableView} (or a custom results template), and
 * {@link UIPagination} into a single search screen.
 *
 * ### Table mode (default)
 * ```html
 * <ui-search-view [datasource]="ds" title="Users">
 *   <ui-text-column key="name" headerText="Name" />
 *   <ui-text-column key="email" headerText="Email" />
 * </ui-search-view>
 * ```
 *
 * ### Custom results template
 * ```html
 * <ui-search-view [datasource]="ds" layout="custom" [filterFields]="fields">
 *   <ng-template #results let-items>
 *     @for (item of items; track item.id) {
 *       <app-card [data]="item" />
 *     }
 *   </ng-template>
 * </ui-search-view>
 * ```
 *
 * ### With custom filter template
 * ```html
 * <ui-search-view [datasource]="ds">
 *   <ng-template #filter>
 *     <my-custom-filter (change)="applyFilter($event)" />
 *   </ng-template>
 *   <ui-text-column key="name" headerText="Name" />
 * </ui-search-view>
 * ```
 */
@Component({
  selector: "ui-search-view",
  standalone: true,
  imports: [
    UIButton,
    UIDialog,
    UIDialogBody,
    UIDialogFooter,
    UIDialogHeader,
    UIFilter,
    UIInput,
    UITableView,
    UIPagination,
    UIIcon,
    NgTemplateOutlet,
  ],
  templateUrl: "./search-view.component.html",
  styleUrl: "./search-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-search-view",
  },
})
export class UISearchView<T = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Title displayed in the header area. */
  public readonly title = input<string>("Results");

  /**
   * The datasource powering the search results.
   *
   * Accepts any {@link IDatasource}. When the datasource is a
   * {@link FilterableArrayDatasource} the component automatically
   * applies filter expressions from the embedded filter.
   */
  public readonly datasource = input<IDatasource<T> | undefined>(undefined);

  /**
   * Results layout mode.
   *
   * - `'table'` (default) — uses `<ui-table-view>` with projected columns.
   * - `'custom'` — renders the projected `#results` template.
   */
  public readonly layout = input<SearchViewLayout>("table");

  /**
   * Explicit filter field definitions.
   *
   * When provided these override the auto-inferred fields derived
   * from projected columns and sample data.
   */
  public readonly filterFields = input<FilterFieldDefinition<T>[] | undefined>(
    undefined,
  );

  /**
   * Whether the filter section is visible.
   *
   * - `true` — always show the filter.
   * - `false` — never show the filter.
   * - `undefined` (default) — auto-detect: show when the datasource
   *   is a {@link FilterableArrayDatasource}.
   */
  public readonly showFilter = input<boolean | undefined>(undefined);

  /** Whether the filter section starts expanded. */
  public readonly filterExpanded = input<boolean>(true);

  /** Whether the filter toggle button is hidden. */
  public readonly filterModeLocked = input<boolean>(false);

  /** Whether to show the pagination footer. */
  public readonly showPagination = input<boolean>(true);

  /** Items per page. */
  public readonly pageSize = input<number>(25);

  /** Available page-size options in the pagination selector. */
  public readonly pageSizeOptions = input<readonly number[]>([10, 25, 50, 100]);

  /** Placeholder text shown when there are no results. */
  public readonly placeholder = input<string>("No results found");

  /** Accessible label for the component. */
  public readonly ariaLabel = input<string>("Search view");

  /**
   * Storage key that enables the saved-searches feature.
   *
   * When set, a toolbar strip is shown allowing users to save, load,
   * and delete named filter states. The key is used to namespace the
   * persisted data in the underlying {@link StorageService}.
   *
   * Leave `undefined` (default) to disable saved searches.
   */
  public readonly storageKey = input<string | undefined>(undefined);

  // ── Outputs ───────────────────────────────────────────────────────

  /**
   * Emits the {@link FilterExpression} every time the filter rules change.
   */
  public readonly expressionChange = output<FilterExpression<T>>();

  /** Emits when the page changes. */
  public readonly pageChange = output<PageChangeEvent>();

  /** Emits when a saved search is loaded, saved, or deleted. */
  public readonly savedSearchChange = output<SavedSearch | null>();

  // ── Models ────────────────────────────────────────────────────────

  /** The filter descriptor state (two-way bindable). */
  public readonly filterDescriptor = model<FilterDescriptor<T>>({
    junction: "and",
    rules: [],
  });

  /** Current page index (two-way bindable, zero-based). */
  public readonly pageIndex = model<number>(0);

  // ── Content queries ───────────────────────────────────────────────

  /** Projected table-view columns (used in table layout mode). */
  public readonly columns = contentChildren(UITableViewColumn);

  /** Optional custom results template (used in custom layout mode). */
  public readonly resultsTemplate =
    contentChild<TemplateRef<SearchViewResultsContext<T>>>("results");

  /** Optional custom filter template. */
  public readonly filterTemplate = contentChild<TemplateRef<unknown>>("filter");

  /** Optional empty-state template. */
  public readonly emptyTemplate = contentChild<TemplateRef<unknown>>("empty");

  // ── View queries ──────────────────────────────────────────────────

  /** @internal — reference to the embedded table-view (when in table layout). */
  private readonly tableView = viewChild(UITableView);

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal */
  protected readonly chevronRight = UIIcons.Lucide.Arrows.ChevronRight;

  /** @internal */
  protected readonly chevronDown = UIIcons.Lucide.Arrows.ChevronDown;

  /** @internal — whether the filter panel is collapsed. */
  protected readonly filterCollapsed = signal<boolean>(false);

  /** @internal — total item count from the datasource. */
  protected readonly totalItems = signal<number>(0);

  /** @internal */
  protected readonly resolvedShowFilter = computed(() => {
    const explicit = this.showFilter();
    if (explicit !== undefined) return explicit;
    return this.datasource() instanceof FilterableArrayDatasource;
  });

  /** @internal — auto-inferred or explicit filter fields. */
  protected readonly resolvedFilterFields = computed(() => {
    const explicit = this.filterFields();
    if (explicit) return explicit;

    const ds = this.datasource();
    if (!ds) return [];

    const cols = this.columns();
    const columnMeta: ColumnMeta[] = cols.map((c) => ({
      key: c.key(),
      headerText: c.headerText(),
    }));

    // Prefer the full unfiltered list when available
    const allRows =
      ds instanceof FilterableArrayDatasource ? ds.allRows : undefined;

    let sample: T | undefined;
    if (allRows && allRows.length > 0) {
      sample = allRows[0];
    } else {
      const count = ds.getNumberOfItems();
      if (typeof count !== "number" || count === 0) return [];
      const result = ds.getObjectAtRowIndex(0);
      if (!result || result instanceof Promise) return [];
      sample = result;
    }

    if (!sample) return [];

    return inferFilterFields(
      sample as Record<string, unknown>,
      columnMeta.length > 0 ? columnMeta : undefined,
    ) as FilterFieldDefinition<T>[];
  });

  /** @internal — sample data for filter value suggestions. */
  protected readonly resolvedFilterData = computed<readonly T[]>(() => {
    const ds = this.datasource();
    if (!ds) return [];

    if (ds instanceof FilterableArrayDatasource) {
      const all = ds.allRows;
      return all.length < 1000 ? all : [];
    }

    const count = ds.getNumberOfItems();
    if (typeof count !== "number" || count === 0 || count >= 1000) return [];
    const rows: T[] = [];
    for (let i = 0; i < count; i++) {
      const row = ds.getObjectAtRowIndex(i);
      if (!(row instanceof Promise)) rows.push(row);
    }
    return rows;
  });

  // ── Saved-search state ──────────────────────────────────────────

  /** @internal — whether the saved-searches feature is enabled. */
  protected readonly savedSearchesEnabled = computed(
    () => this.storageKey() !== undefined,
  );

  /** @internal — list of persisted saved searches. */
  protected readonly savedSearches = signal<readonly SavedSearch[]>([]);

  /** @internal — ID of the currently selected saved search (empty = none). */
  protected readonly selectedSearchId = signal<string>("");

  /** @internal — name input value when saving a filter. */
  protected readonly searchName = signal<string>("");

  /** @internal — whether the save-filter dialog is open. */
  protected readonly saveDialogOpen = signal<boolean>(false);

  /** @internal — index of the chip being dragged (−1 = none). */
  private dragSourceIndex = -1;

  /**
   * @internal — bumped after every `filterBy` call so computeds
   * that depend on the datasource's filtered state re-evaluate.
   */
  private readonly _filterVersion = signal(0);

  /**
   * @internal — the rows for the current page (filtered + paged).
   * Used only for custom layout mode where the table is not
   * available to handle paging internally.
   */
  protected readonly pagedRows = computed<readonly T[]>(() => {
    this._filterVersion();
    const ds = this.datasource();
    if (!ds) return [];

    const total = ds.getNumberOfItems();
    if (typeof total !== "number" || total === 0) return [];

    if (!this.showPagination()) {
      const rows: T[] = [];
      for (let i = 0; i < total; i++) {
        const row = ds.getObjectAtRowIndex(i);
        if (!(row instanceof Promise)) rows.push(row);
      }
      return rows;
    }

    const size = this.pageSize();
    const start = this.pageIndex() * size;
    const end = Math.min(start + size, total);

    const rows: T[] = [];
    for (let i = start; i < end; i++) {
      const row = ds.getObjectAtRowIndex(i);
      if (!(row instanceof Promise)) rows.push(row);
    }
    return rows;
  });

  private readonly savedSearchService = inject(SavedSearchService);

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    this.filterCollapsed.set(!this.filterExpanded());

    effect(() => {
      this.filterCollapsed.set(!this.filterExpanded());
    });

    effect(() => {
      const ds = this.datasource();
      if (!ds) {
        this.totalItems.set(0);
        return;
      }
      const count = ds.getNumberOfItems();
      if (typeof count === "number") {
        this.totalItems.set(count);
      }
    });

    // Reload persisted saved searches whenever the storage key changes.
    effect(() => {
      const key = this.storageKey();
      if (key) {
        this.savedSearches.set(this.savedSearchService.list(key));
      } else {
        this.savedSearches.set([]);
      }
      this.selectedSearchId.set("");
      this.saveDialogOpen.set(false);
    });
  }

  // ── Public methods ────────────────────────────────────────────────

  /** Toggle the filter panel open/closed. */
  public toggleFilter(): void {
    this.filterCollapsed.update((c) => !c);
  }

  /**
   * Load a saved search by its ID, applying its filter descriptor
   * to the search view.
   */
  public loadSavedSearch(searchId: string): void {
    if (!searchId) {
      this.selectedSearchId.set("");
      return;
    }
    const search = this.savedSearches().find((s) => s.id === searchId);
    if (search) {
      this.filterDescriptor.set(structuredClone(search.descriptor));
      this.selectedSearchId.set(search.id);
      this.savedSearchChange.emit(search);
    }
  }

  /**
   * Save the current filter state as a new named search.
   */
  public saveNewSearch(name: string): void {
    const key = this.storageKey();
    if (!key || !name.trim()) return;

    const search: SavedSearch<T> = {
      id: crypto.randomUUID(),
      name: name.trim(),
      descriptor: structuredClone(this.filterDescriptor()),
      savedAt: new Date().toISOString(),
    };

    this.savedSearchService.save(key, search as SavedSearch);
    this.savedSearches.set(this.savedSearchService.list(key));
    this.selectedSearchId.set(search.id);
    this.saveDialogOpen.set(false);
    this.searchName.set("");
    this.savedSearchChange.emit(search as SavedSearch);
  }

  /**
   * Delete a saved search by its ID.
   */
  public deleteSavedSearch(searchId: string): void {
    const key = this.storageKey();
    if (!key) return;

    this.savedSearchService.remove(key, searchId);
    this.savedSearches.set(this.savedSearchService.list(key));
    if (this.selectedSearchId() === searchId) {
      this.selectedSearchId.set("");
    }
    this.savedSearchChange.emit(null);
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal */
  protected readonly saveIcon = UIIcons.Lucide.Files.Save;

  /** @internal */
  protected readonly xIcon = UIIcons.Lucide.Math.X;

  /** @internal */
  protected onLoadSearch(searchId: string): void {
    this.loadSavedSearch(searchId);
  }

  /** @internal */
  protected onDeleteSearch(event: Event, searchId: string): void {
    event.stopPropagation();
    this.deleteSavedSearch(searchId);
  }

  /** @internal — opens the save-filter dialog. */
  protected onSaveFilterClick(): void {
    this.searchName.set("");
    this.saveDialogOpen.set(true);
  }

  /** @internal */
  protected onConfirmSave(): void {
    this.saveNewSearch(this.searchName());
  }

  /** @internal */
  protected onCancelSave(): void {
    this.saveDialogOpen.set(false);
    this.searchName.set("");
  }

  // ── Chip drag-and-drop reorder ────────────────────────────────────

  /** @internal */
  protected onChipDragStart(event: DragEvent, index: number): void {
    this.dragSourceIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  }

  /** @internal */
  protected onChipDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  /** @internal */
  protected onChipDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const from = this.dragSourceIndex;
    if (from < 0 || from === targetIndex) return;

    const key = this.storageKey();
    if (!key) return;

    const list = [...this.savedSearches()];
    const [moved] = list.splice(from, 1);
    list.splice(targetIndex, 0, moved);

    const orderedIds = list.map((s) => s.id);
    this.savedSearchService.reorder(key, orderedIds);
    this.savedSearches.set(this.savedSearchService.list(key));
    this.dragSourceIndex = -1;
  }

  /** @internal */
  protected onChipDragEnd(): void {
    this.dragSourceIndex = -1;
  }

  /** @internal */
  protected onFilterExpressionChange(expression: FilterExpression<T>): void {
    this.expressionChange.emit(expression);

    const ds = this.datasource();
    if (ds instanceof FilterableArrayDatasource) {
      const compiled = toFilterExpression(
        expression,
        this.resolvedFilterFields(),
      );
      ds.filterBy(compiled.length === 0 ? null : compiled);
      const count = ds.getNumberOfItems();
      this.totalItems.set(typeof count === "number" ? count : 0);
      this.pageIndex.set(0);

      // Tell the table to rebuild its adapter so it picks up the
      // newly filtered datasource content.
      this.tableView()?.refreshDatasource();
    }
    this._filterVersion.update((v) => v + 1);
  }

  /** @internal */
  protected onPageChange(event: PageChangeEvent): void {
    this.pageChange.emit(event);
  }
}
