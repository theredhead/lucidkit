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
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import {
  FilterableArrayTreeDatasource,
  isTreeDatasource,
  type IDatasource,
  type Predicate,
} from "@theredhead/foundation";
import {
  FilterableArrayDatasource,
  SelectionModel,
  UIFilter,
  UIIcon,
  UIIcons,
  UISplitContainer,
  UITableView,
  UITableViewColumn,
  UITreeView,
  inferFilterFields,
  toPredicate,
  type ColumnMeta,
  type FilterDescriptor,
  type FilterExpression,
  type FilterFieldDefinition,
  type ITreeDatasource,
  type SplitCollapseTarget,
  type SplitPanelConstraints,
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
 * <ui-master-detail-view [datasource]="adapter" title="People">
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
 * <ui-master-detail-view [datasource]="treeDs" [treeDisplayWith]="labelFn">
 *   <ng-template #detail let-object>
 *     <h3>{{ object.name }}</h3>
 *   </ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### With filter
 * ```html
 * <!-- Auto-inferred fields from columns + data types -->
 * <ui-master-detail-view [datasource]="adapter" [showFilter]="true">
 *   <ui-text-column key="name" headerText="Name" />
 *   <ui-text-column key="email" headerText="Email" />
 *   <ng-template #detail let-object>…</ng-template>
 * </ui-master-detail-view>
 * ```
 *
 * ### With custom filter template (override)
 * ```html
 * <ui-master-detail-view [datasource]="adapter" [showFilter]="true">
 *   <ng-template #filter>
 *     <ui-filter [fields]="fields" [(value)]="descriptor"
 *                (expressionChange)="ds.filterBy($event)" />
 *   </ng-template>
 *   <!-- columns and detail template -->
 * </ui-master-detail-view>
 * ```
 */
@Component({
  selector: "ui-master-detail-view",
  standalone: true,
  imports: [
    UISplitContainer,
    UITableView,
    UITreeView,
    UIFilter,
    NgTemplateOutlet,
    UIIcon,
  ],
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
   * The datasource powering the master list.
   *
   * Accepts any {@link IDatasource} (for flat table mode)
   * or an {@link ITreeDatasource} (for hierarchical tree mode).
   * The component detects the type at runtime and renders the
   * appropriate view.
   */
  public readonly datasource = input<
    IDatasource<T> | ITreeDatasource<T> | undefined
  >(undefined);

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
   * Whether the filter toggle button is hidden.
   *
   * When `true`, the toggle is removed and the filter section stays
   * permanently in whatever state `filterExpanded` dictates:
   * - `filterExpanded: true` + `filterModeLocked: true` → filter is
   *   always visible, cannot be collapsed.
   * - `filterExpanded: false` + `filterModeLocked: true` → filter bar
   *   is completely hidden (equivalent to `showFilter: false`).
   *
   * This value is also forwarded to the embedded `<ui-filter>` as
   * `[modeLocked]`, preventing the user from toggling between
   * simple and advanced filter modes.
   */
  public readonly filterModeLocked = input<boolean>(false);

  /**
   * Explicit filter field definitions.
   *
   * When provided these override the auto-inferred fields.
   * Only relevant when no `#filter` template is projected.
   */
  public readonly filterFields = input<FilterFieldDefinition<T>[] | undefined>(
    undefined,
  );

  /**
   * Initial split sizes as a `[list, detail]` percentage tuple.
   * Must sum to 100. Defaults to `[33, 67]`.
   */
  public readonly splitSizes = input<readonly [number, number]>([33, 67]);

  /**
   * Optional localStorage key for persisting the split panel sizes.
   * When set the user's last divider position is restored on init.
   */
  public readonly splitName = input<string | undefined>(undefined);

  /**
   * Which panel to collapse when the divider is double-clicked.
   * Defaults to `'first'` so the list panel can be collapsed.
   */
  public readonly splitCollapseTarget = input<SplitCollapseTarget>("first");

  /**
   * Size constraints for the list (first) panel in pixels.
   * Defaults to `{ min: 200 }`.
   */
  public readonly listConstraints = input<SplitPanelConstraints>({
    min: 200,
  });

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emits whenever the selection changes. Carries the selected item or `undefined`. */
  public readonly selectedChange = output<T | undefined>();

  /**
   * Emits the {@link FilterExpression} every time the filter rules
   * change. Emits an empty array when no valid rules remain.
   *
   * For {@link FilterableArrayDatasource} instances the expression is
   * applied automatically — this output is for consumers who use a
   * custom datasource and need to handle filtering manually.
   */
  public readonly expressionChange = output<FilterExpression<T>>();

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

  // ── View queries ──────────────────────────────────────────────────

  /** @internal — the internal table view instance (table mode). */
  private readonly tableViewChild = viewChild(UITableView);

  // ── Computed ──────────────────────────────────────────────────────

  /**
   * Whether the component is in tree mode.
   * `true` when the `datasource` input is an `ITreeDatasource`. @internal
   */
  protected readonly isTreeMode = computed(() =>
    isTreeDatasource(this.datasource()),
  );

  /**
   * The tree datasource, extracted from the unified `datasource`
   * input. Returns `undefined` when not in tree mode.
   * @internal
   */
  protected readonly resolvedTreeDatasource = computed<
    ITreeDatasource<T> | undefined
  >(() => {
    const ds = this.datasource();
    return isTreeDatasource<T>(ds) ? ds : undefined;
  });

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
   * The resolved flat-table datasource.
   *
   * Returns the `datasource` input when it is a flat
   * {@link IDatasource} (not a tree). Falls back to an empty
   * {@link FilterableArrayDatasource} when no datasource is set or
   * when the input is a tree datasource.
   * @internal
   */
  protected readonly resolvedTableDatasource = computed<IDatasource<T>>(() => {
    const explicit = this.datasource();
    if (explicit && !isTreeDatasource(explicit)) {
      return explicit;
    }
    return new FilterableArrayDatasource<T>([]);
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

    // Tree mode: auto-show when a tree datasource is provided
    if (this.resolvedTreeDatasource() !== undefined) return false;

    // Auto-detect: show filter when the datasource supports filtering
    const ds = this.resolvedTableDatasource();
    return ds instanceof FilterableArrayDatasource;
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

    // ── Tree mode: infer from tree node data ──
    const treeDs = this.resolvedTreeDatasource();
    if (treeDs) {
      const flatData = this.collectTreeData(treeDs);
      if (flatData.length === 0) return [];
      return inferFilterFields(
        flatData[0] as Record<string, unknown>,
      ) as FilterFieldDefinition<T>[];
    }

    // ── Table mode: infer from columns + datasource rows ──
    // Derive column metadata from projected UITableViewColumn instances
    const cols = this.columns();
    const columnMeta: ColumnMeta[] = cols.map((c) => ({
      key: c.key(),
      headerText: c.headerText(),
    }));

    // Get a sample row from the *unfiltered* datasource to sniff
    // types.  We must NOT use getNumberOfItems() on a filtered
    // datasource — the filtered count drops to 0 when no rows match
    // the current predicate and would make the filter fields (and
    // the filter component) disappear.
    const ds = this.resolvedTableDatasource();

    // Prefer the full unfiltered list when available
    const allRows =
      ds instanceof FilterableArrayDatasource ? ds.allRows : undefined;

    let sample: T | undefined;
    if (allRows && allRows.length > 0) {
      sample = allRows[0];
    } else {
      // Fallback for non-filterable datasources
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

  /**
   * The raw data array for the embedded filter (used to derive
   * distinct values for autocomplete / select).
   * @internal
   */
  protected readonly resolvedFilterData = computed<readonly T[]>(() => {
    // ── Tree mode: flatten all node data ──
    const treeDs = this.resolvedTreeDatasource();
    if (treeDs) {
      const flatData = this.collectTreeData(treeDs);
      return flatData.length < 1000 ? flatData : [];
    }

    // ── Table mode ──
    const ds = this.resolvedTableDatasource();

    // Use the full unfiltered dataset when available so that distinct
    // value lists and autocomplete options don't shrink as the user
    // narrows the filter.
    if (ds instanceof FilterableArrayDatasource) {
      const all = ds.allRows;
      return all.length < 1000 ? all : [];
    }

    // Fallback for non-filterable datasources: gather visible rows
    const count = ds.getNumberOfItems();
    if (typeof count !== "number" || count === 0 || count >= 1000) return [];
    const rows: T[] = [];
    for (let i = 0; i < count; i++) {
      const row = ds.getObjectAtRowIndex(i);
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

  /**
   * The current filter predicate for tree mode.
   * Forwarded to the `<ui-tree-view>` `filterPredicate` input.
   * @internal
   */
  protected readonly treeFilterPredicate = signal<Predicate<T> | undefined>(
    undefined,
  );

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
   * Called by the embedded `<ui-filter>` when the expression changes.
   *
   * - For {@link FilterableArrayDatasource} the expression is applied
   *   via `filterBy()` and the adapter is refreshed.
   * - For tree mode the expression is compiled into a predicate for
   *   the tree-view's `filterPredicate` input.
   * - Always emits via {@link expressionChange} so consumers with
   *   custom datasources can react.
   */
  public onFilterExpressionChange(expression: FilterExpression<T>): void {
    this.expressionChange.emit(expression);

    if (this.isTreeMode()) {
      const treeDs = this.resolvedTreeDatasource();

      // FilterableArrayTreeDatasource: pass expression directly
      if (treeDs instanceof FilterableArrayTreeDatasource) {
        treeDs.filterBy(expression);
        return;
      }

      // Plain ITreeDatasource: fall back to tree-view filterPredicate input
      const fields = this.resolvedFilterFields();
      const descriptor = this.filterDescriptor();
      this.treeFilterPredicate.set(toPredicate(descriptor, fields));
      return;
    }

    // Table mode: apply expression to FilterableArrayDatasource
    const ds = this.resolvedTableDatasource();
    if (ds instanceof FilterableArrayDatasource) {
      ds.filterBy(expression);
      this.tableViewChild()?.refreshDatasource();
    }
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — toggle filter visibility. */
  protected toggleFilter(): void {
    this.filterCollapsed.update((v) => !v);
  }

  // ── Private helpers ───────────────────────────────────────────────

  /**
   * Recursively collects the `data` payloads from every node in the
   * tree datasource into a flat array. Used to infer filter fields
   * and provide distinct values in tree mode.
   */
  private collectTreeData(ds: ITreeDatasource<T>): T[] {
    const items: T[] = [];
    const walk = (nodes: TreeNode<T>[]): void => {
      for (const node of nodes) {
        items.push(node.data);
        const children = ds.getChildren(node);
        if (Array.isArray(children)) walk(children);
      }
    };
    const roots = ds.getRootNodes();
    if (Array.isArray(roots)) walk(roots);
    return items;
  }
}
