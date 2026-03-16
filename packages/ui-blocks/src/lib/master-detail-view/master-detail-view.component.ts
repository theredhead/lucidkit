import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  effect,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
  type Predicate,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  ArrayDatasource,
  DatasourceAdapter,
  FilterableArrayDatasource,
  SelectionModel,
  UIFilter,
  UIIcon,
  UIIcons,
  UITableView,
  UITableViewColumn,
  UITreeView,
  inferFilterFields,
  type ColumnMeta,
  type FilterDescriptor,
  type FilterFieldDefinition,
  type ITreeDatasource,
  type TreeNode,
  type TreeNodeContext,
} from "@theredhead/ui-kit";

/**
 * Context provided to the detail template.
 *
 * @typeParam T - The row object type.
 */
export interface MasterDetailContext<T> {
  /** The selected item (also available as `let-object`). */
  $implicit: T;
}

/**
 * A master-detail layout that shows a list of items in a
 * {@link UITableView} and renders a detail template for the
 * currently selected item.
 *
 * ### Basic usage (table mode)
 * ```html
 * <ui-master-detail-view [data]="items">
 *   <ui-text-column key="name" headerText="Name" />
 *   <ui-text-column key="email" headerText="Email" />
 *
 *   <ng-template #detail let-object>
 *     <h3>{{ object.name }}</h3>
 *     <p>{{ object.email }}</p>
 *   </ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### Tree mode
 * ```html
 * <ui-master-detail-view [treeDatasource]="treeDs" [displayWith]="labelFn">
 *   <ng-template #detail let-object>
 *     <h3>{{ object.name }}</h3>
 *   </ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### With filter
 * ```html
 * <!-- Auto-inferred fields from columns + data types -->
 * <ui-master-detail-view [data]="items" [showFilter]="true">
 *   <ui-text-column key="name" headerText="Name" />
 *   <ui-text-column key="email" headerText="Email" />
 *   <ng-template #detail let-object>…</ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### With custom filter template (override)
 * ```html
 * <ui-master-detail-view [data]="items" [showFilter]="true">
 *   <ng-template #filter>
 *     <ui-filter [fields]="fields" [(value)]="descriptor"
 *                (predicateChange)="ds.applyPredicate($event)" />
 *   </ng-template>
 *   <!-- columns and detail template -->
 * </ui-master-detail-view>
 * ```
 */
@Component({
  selector: "ui-master-detail-view",
  standalone: true,
  imports: [UITableView, UITreeView, UIFilter, NgTemplateOutlet, UIIcon],
  templateUrl: "./master-detail-view.component.html",
  styleUrl: "./master-detail-view.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-master-detail-view",
  },
})
export class UIMasterDetailView<T = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Title displayed above the list panel. */
  public readonly title = input<string>("Items");

  /**
   * The datasource adapter powering the table-view.
   *
   * When provided, this takes precedence over the `data` input.
   * The adapter should be pre-configured with a page size of 100.
   */
  public readonly datasource = input<DatasourceAdapter<T> | undefined>(
    undefined,
  );

  /**
   * Convenience: raw data array. When set, an internal
   * {@link ArrayDatasource} is created automatically.
   * Ignored when `datasource` is provided.
   */
  public readonly data = input<readonly T[]>([]);

  /**
   * Tree datasource for hierarchical master lists.
   *
   * When provided, the list panel renders a `<ui-tree-view>` instead
   * of a `<ui-table-view>`. The `data`, `datasource`, and column
   * inputs are ignored in tree mode.
   */
  public readonly treeDatasource = input<ITreeDatasource<T> | undefined>(
    undefined,
  );

  /**
   * Function that returns a display string for tree node data.
   * Only used in tree mode when no `#nodeTemplate` is projected.
   * Defaults to `String(data)`.
   */
  public readonly treeDisplayWith = input<(data: T) => string>((data: T) =>
    String(data),
  );

  /** Placeholder text shown when no item is selected. */
  public readonly placeholder = input<string>("Select an item to view details");

  /**
   * Whether the filter section is visible.
   *
   * - `true` — always show the filter.
   * - `false` — never show the filter.
   * - `undefined` (default) — auto-detect: show the filter when the
   *   resolved datasource is a {@link FilterableArrayDatasource}.
   *
   * When shown without a projected `#filter` template, the component
   * embeds a `<ui-filter>` internally using auto-inferred field
   * definitions.
   */
  public readonly showFilter = input<boolean | undefined>(undefined);

  /** Whether the filter section starts expanded. */
  public readonly filterExpanded = input<boolean>(true);

  /**
   * Explicit filter field definitions.
   *
   * When provided these override the auto-inferred fields.
   * Only relevant when no `#filter` template is projected.
   */
  public readonly filterFields = input<FilterFieldDefinition<T>[] | undefined>(
    undefined,
  );

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emits whenever the selection changes. Carries the selected item or `undefined`. */
  public readonly selectedChange = output<T | undefined>();

  /**
   * Emits the compiled `Predicate<T>` every time the filter rules
   * change. Emits `undefined` when no valid rules remain.
   *
   * For {@link FilterableArrayDatasource} instances the predicate is
   * applied automatically — this output is for consumers who use a
   * custom datasource and need to handle filtering manually.
   */
  public readonly predicateChange = output<Predicate<T> | undefined>();

  // ── Models ────────────────────────────────────────────────────────

  /**
   * The filter descriptor state (two-way bindable).
   *
   * Provides full read/write access to the filter's rule set and
   * junction mode. Defaults to an empty AND descriptor.
   */
  public readonly filterDescriptor = model<FilterDescriptor<T>>({
    junction: "and",
    rules: [],
  });

  // ── Content queries ───────────────────────────────────────────────

  /**
   * Projected table-view columns.
   * These are forwarded to the internal `<ui-table-view>`.
   */
  public readonly columns = contentChildren(UITableViewColumn);

  /** Detail template — rendered when an item is selected. */
  public readonly detailTemplate =
    contentChild<TemplateRef<MasterDetailContext<T>>>("detail");

  /** Optional filter template — shown in the collapsible filter area. */
  public readonly filterTemplate = contentChild<TemplateRef<unknown>>("filter");

  /**
   * Optional tree-node template — forwarded to `<ui-tree-view>`.
   * Receives {@link TreeNodeContext} as its context.
   */
  public readonly treeNodeTemplate =
    contentChild<TemplateRef<TreeNodeContext<T>>>("nodeTemplate");

  // ── Computed ──────────────────────────────────────────────────────

  /**
   * Whether the component is in tree mode.
   * `true` when a `treeDatasource` is provided. @internal
   */
  protected readonly isTreeMode = computed(
    () => this.treeDatasource() !== undefined,
  );

  /**
   * The currently selected item, derived from the table selection
   * model or the tree selection signal. @internal
   */
  protected readonly selectedItem = computed<T | undefined>(() => {
    if (this.isTreeMode()) {
      const nodes = this.selectedTreeNodes();
      return nodes.length > 0 ? nodes[0].data : undefined;
    }
    const items = this.selectionModel.selected();
    return items.length > 0 ? items[0] : undefined;
  });

  /** Context for the detail template outlet. @internal */
  protected readonly detailContext = computed<
    MasterDetailContext<T> | undefined
  >(() => {
    const item = this.selectedItem();
    if (item === undefined) return undefined;
    return { $implicit: item };
  });

  /**
   * The resolved datasource: explicit `datasource` input takes
   * precedence, otherwise an internal adapter wraps the `data` array
   * using a {@link FilterableArrayDatasource} (so built-in filter
   * support is available automatically).
   *
   * The adapter construction is wrapped in `untracked` because
   * {@link DatasourceAdapter}'s constructor writes to signals,
   * which is forbidden inside `computed` contexts.
   * @internal
   */
  protected readonly resolvedDatasource = computed<DatasourceAdapter<T>>(() => {
    const explicit = this.datasource();
    if (explicit) return explicit;
    const data = this.data();
    return untracked(
      () =>
        new DatasourceAdapter<T>(
          new FilterableArrayDatasource<T>([...(data as T[])]),
          100,
        ),
    );
  });

  /**
   * Whether the filter section should be displayed.
   *
   * - Explicit `showFilter` input wins when not `undefined`.
   * - Otherwise auto-detects: `true` when the underlying raw
   *   datasource is a {@link FilterableArrayDatasource}.
   * @internal
   */
  protected readonly resolvedShowFilter = computed<boolean>(() => {
    const explicit = this.showFilter();
    if (explicit !== undefined) return explicit;

    // Auto-detect: unwrap the DatasourceAdapter to check the raw datasource
    const adapter = this.resolvedDatasource();
    return adapter.datasource instanceof FilterableArrayDatasource;
  });

  /**
   * The filter field definitions used by the embedded `<ui-filter>`.
   *
   * Priority: explicit `filterFields` input → inferred from projected
   * columns and the first data row.
   * @internal
   */
  protected readonly resolvedFilterFields = computed<
    FilterFieldDefinition<T>[]
  >(() => {
    const explicit = this.filterFields();
    if (explicit) return explicit;

    // Derive column metadata from projected UITableViewColumn instances
    const cols = this.columns();
    const columnMeta: ColumnMeta[] = cols.map((c) => ({
      key: c.key(),
      headerText: c.headerText(),
    }));

    // Get a sample row from the datasource to sniff types
    const adapter = this.resolvedDatasource();
    const count = adapter.totalItems();
    if (count === 0) return [];

    const sample = adapter.datasource.getObjectAtRowIndex(0);
    if (!sample || sample instanceof Promise) return [];

    return inferFilterFields(
      sample as Record<string, unknown>,
      columnMeta.length > 0 ? columnMeta : undefined,
    ) as FilterFieldDefinition<T>[];
  });

  /**
   * The raw data array for the embedded filter (used to derive
   * distinct values for autocomplete / select).
   * @internal
   */
  protected readonly resolvedFilterData = computed<readonly T[]>(() => {
    const adapter = this.resolvedDatasource();
    const raw = adapter.datasource;
    // For FilterableArrayDatasource, access the full unfiltered data
    // For plain ArrayDatasource, gather all rows
    const count = raw.getNumberOfItems();
    if (typeof count !== "number" || count === 0 || count >= 1000) return [];
    const rows: T[] = [];
    for (let i = 0; i < count; i++) {
      const row = raw.getObjectAtRowIndex(i);
      if (!(row instanceof Promise)) rows.push(row);
    }
    return rows;
  });

  // ── Public fields ───────────────────────────────────────────────

  /** Selection model for the table-view (single mode). */
  public readonly selectionModel = new SelectionModel<T>("single");

  // ── Protected fields ──────────────────────────────────────────────

  /** @internal — currently selected tree nodes (tree mode). */
  protected readonly selectedTreeNodes = signal<readonly TreeNode<T>[]>([]);

  /** @internal — whether the filter section is collapsed. */
  protected readonly filterCollapsed = signal(false);

  // ── Protected constants ───────────────────────────────────────────

  /** @internal */
  protected readonly chevronDown = UIIcons.Lucide.Arrows.ChevronDown;

  /** @internal */
  protected readonly chevronRight = UIIcons.Lucide.Arrows.ChevronRight;

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Initialise filterCollapsed from the filterExpanded input
    effect(() => {
      const expanded = this.filterExpanded();
      untracked(() => this.filterCollapsed.set(!expanded));
    });

    // Emit selectedChange whenever selection changes
    effect(() => {
      const item = this.selectedItem();
      untracked(() => this.selectedChange.emit(item));
    });
  }

  // ── Public methods ────────────────────────────────────────────────

  /**
   * Called by the embedded `<ui-filter>` when the predicate changes.
   *
   * - For {@link FilterableArrayDatasource} the predicate is applied
   *   automatically and the adapter is refreshed.
   * - Always emits via {@link predicateChange} so consumers with
   *   custom datasources can react.
   */
  public onFilterPredicateChange(predicate: Predicate<T> | undefined): void {
    this.predicateChange.emit(predicate);

    const adapter = this.resolvedDatasource();
    const raw = adapter.datasource;
    if (raw instanceof FilterableArrayDatasource) {
      raw.applyPredicate(predicate ?? null);
      adapter.pageIndex.set(0);
      adapter.totalItems.set(raw.getNumberOfItems() as number);
    }
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — toggle filter visibility. */
  protected toggleFilter(): void {
    this.filterCollapsed.update((v) => !v);
  }
}
