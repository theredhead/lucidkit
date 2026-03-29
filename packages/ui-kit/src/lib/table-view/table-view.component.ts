import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  untracked,
} from "@angular/core";

import {
  type IDatasource,
  SortDirection,
  type SortExpression,
  isFilterableDatasource,
  isSortableDatasource,
  UISurface,
  UI_DEFAULT_SURFACE_TYPE,
} from "@theredhead/foundation";

import { ColumnResizeService } from "./column-resize.service";
import { UITableViewColumn } from "./columns/table-column.directive";
import { DatasourceAdapter } from "./datasources/datasource-adapter";
import {
  FLEX_COLUMN_MIN_WIDTH,
  INITIAL_PAGE_SIZE,
  ROW_INDEX_COLUMN_WIDTH,
  SELECTION_COLUMN_WIDTH,
} from "./table-view.constants";
import { UITableBody } from "./table-view-body/table-view-body.component";
import { UITableFooter } from "./table-view-footer/table-view-footer.component";
import {
  ColumnResizeEvent,
  SortState,
  UITableHeader,
} from "./table-view-header/table-view-header.component";
import { type SelectionMode, SelectionModel } from "../core/selection-model";

@Component({
  selector: "ui-table-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "table" }],
  imports: [UITableHeader, UITableBody, UITableFooter],
  templateUrl: "./table-view.component.html",
  styleUrl: "./table-view.component.scss",
  host: {
    class: "ui-table-view",
    "[class.ui-table-view--disabled]": "disabled()",
    tabindex: "0",
    "(keydown)": "onKeydown($event)",
  },
})
export class UITableView implements OnInit, AfterViewInit {
  private static nextCaptionId = 0;
  private readonly resizeService = inject(ColumnResizeService);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Whether the table view is disabled. */

  disabled = input<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasource = input.required<IDatasource<any>>();

  /**
   * External page size. When provided, the adapter's page size is set
   * to this value. Leave `undefined` to use the default
   * ({@link INITIAL_PAGE_SIZE}).
   */
  pageSize = input<number | undefined>(undefined);

  /**
   * External page index (zero-based). When provided, the adapter uses
   * this as the current page. Leave `undefined` to let the built-in
   * paginator manage the index.
   */
  pageIndex = input<number | undefined>(undefined);

  /** Bumped to force the adapter computed to rebuild. @internal */
  private readonly _adapterVersion = signal(0);

  /**
   * Internal adapter wrapping the raw datasource for signal-based
   * pagination. Rebuilt whenever the `datasource` input changes or
   * {@link refreshDatasource} is called.
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected readonly adapter = computed<DatasourceAdapter<any>>(() => {
    this._adapterVersion();
    const ds = this.datasource();
    const ps = untracked(() => this.pageSize());
    return untracked(() => new DatasourceAdapter(ds, ps ?? INITIAL_PAGE_SIZE));
  });
  showBuiltInPaginator = input<boolean>(true);
  caption = input<string>("");
  showRowIndexIndicator = input<boolean>(false);
  rowIndexHeaderText = input<string>("#");

  /**
   * Unique identifier for this table instance.
   * Used as key for persisting column widths in localStorage.
   * When set, column resizing is enabled and widths are persisted.
   */
  tableId = input<string>("");

  /**
   * Whether columns can be resized by dragging header borders.
   * Defaults to true when a tableId is provided.
   */
  resizable = input<boolean | undefined>(undefined);

  /**
   * Selection mode for the table.
   * - `'none'` (default): no selection UI.
   * - `'single'`: radio-button column for one-at-a-time selection.
   * - `'multiple'`: checkbox column for multi-row selection.
   */
  selectionMode = input<SelectionMode>("none");

  /**
   * Whether clicking / tapping a row toggles its selection
   * (in addition to clicking the radio / checkbox itself).
   */
  rowClickSelect = input<boolean>(false);

  /**
   * Whether to show the leading radio / checkbox column.
   * Defaults to `true`. Set to `false` when you want row-click
   * selection without a dedicated selection column (e.g. in a
   * master-detail list).
   */
  showSelectionColumn = input<boolean>(true);

  /**
   * Optional external selection model. When provided the table will use
   * this instance instead of creating its own, giving the consumer full
   * programmatic control.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionModel = input<SelectionModel<any> | undefined>(undefined);

  /**
   * Emitted whenever the selection changes. Carries the full list of
   * currently selected row objects.
   */
  selectionChange = output<readonly unknown[]>();

  /**
   * Explicitly provided column directives. When set (non-empty), the table
   * uses these instead of the projected `contentChildren`. This allows
   * wrapper components like `UIMasterDetailView` to query their own
   * content children and forward them here.
   */
  externalColumns = input<readonly UITableViewColumn[]>([]);

  columns = contentChildren(UITableViewColumn);

  /**
   * Columns injected programmatically by directives such as
   * {@link UIAutogenerateColumnsDirective}. Unlike `externalColumns`
   * (which is an input meant for parent templates), this writable
   * signal lets directives on the same host element push columns
   * into the table at runtime.
   *
   * @internal
   */
  readonly dynamicColumns = signal<readonly UITableViewColumn[]>([]);

  protected readonly captionId = `ui-table-caption-${UITableView.nextCaptionId++}`;

  /**
   * The effective column list. Prefers the explicit `externalColumns` input,
   * then `dynamicColumns`, then falls back to the projected `contentChildren`.
   * @internal
   */
  protected readonly resolvedColumns = computed(() => {
    const ext = this.externalColumns();
    if (ext.length > 0) return ext;
    const dyn = this.dynamicColumns();
    if (dyn.length > 0) return dyn;
    return this.columns();
  });

  /**
   * The resolved selection model. Uses the externally-provided model
   * if given, otherwise falls back to the internal one.
   */
  protected readonly selection = computed(() => {
    return this.selectionModel() ?? this._internalSelection;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _internalSelection = new SelectionModel<any>("none");

  protected readonly resolvedRows = signal<unknown[]>([]);
  protected readonly sortState = signal<SortState | null>(null);

  protected readonly captionAriaLabelledBy = computed(() =>
    this.caption().trim() ? this.captionId : null,
  );
  protected readonly rowIndexOffset = computed(
    () => this.adapter().pageIndex() * this.adapter().pageSize(),
  );

  /** Column widths as a record (key → px). Used by both header and body. */
  protected readonly columnWidths = signal<Record<string, number>>({});

  /** Whether resizing is actually enabled (explicit input or inferred from tableId). */
  protected readonly isResizable = computed(() => {
    const explicit = this.resizable();
    if (explicit !== undefined) return explicit;
    return this.tableId().length > 0;
  });

  /**
   * Computed total row width (px) when at least one column has been
   * explicitly resized. Flex columns get a 120px minimum.
   * Returns 0 when no columns have explicit widths (natural sizing).
   */
  protected readonly totalRowWidth = computed(() => {
    const cols = this.resolvedColumns();
    const widths = this.columnWidths();
    const rowIndexWidth = this.showRowIndexIndicator()
      ? ROW_INDEX_COLUMN_WIDTH
      : 0;
    const selectionWidth =
      this.selectionMode() !== "none" && this.showSelectionColumn()
        ? SELECTION_COLUMN_WIDTH
        : 0;

    let total = rowIndexWidth + selectionWidth;
    let hasExplicit = false;
    for (const col of cols) {
      const w = widths[col.key()];
      if (w !== undefined) {
        total += w;
        hasExplicit = true;
      } else {
        total += FLEX_COLUMN_MIN_WIDTH;
      }
    }
    return hasExplicit ? total : 0;
  });

  /**
   * The index of the currently active (keyboard-focused) row, or −1
   * when no row is active.
   */
  protected readonly activeIndex = signal(-1);

  /** Generation counter to discard stale promise resolutions after page changes. */
  private resolveGeneration = 0;

  /**
   * Whether the underlying datasource supports sorting via {@link ISortableDatasource}.
   * When true, sorting is delegated to the datasource; otherwise, rows are sorted
   * in-component.
   */
  protected readonly supportsSorting = computed(() => {
    return isSortableDatasource(this.datasource());
  });

  /**
   * Whether the underlying datasource supports filtering via {@link IFilterableDatasource}.
   * When true, filtering is delegated to the datasource; otherwise, filtering
   * is not available.
   */
  protected readonly supportsFiltering = computed(() => {
    return isFilterableDatasource(this.datasource());
  });

  protected readonly sortedRows = computed(() => {
    const rows = this.resolvedRows();
    const sort = this.sortState();

    // If the underlying datasource handles sorting, don't sort in-component
    if (this.supportsSorting()) {
      return rows;
    }

    // Fallback: sort in-component (legacy behavior)
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      // Keep loading placeholders (null) in place – don't try to sort them
      if (a === null || b === null) return 0;
      const va = String((a as Record<string, unknown>)[sort.key] ?? "");
      const vb = String((b as Record<string, unknown>)[sort.key] ?? "");
      const cmp = va.localeCompare(vb);
      return sort.direction === "asc" ? cmp : -cmp;
    });
  });

  constructor() {
    // ── Sync external pageSize / pageIndex inputs into the adapter ──
    effect(() => {
      const ps = this.pageSize();
      if (ps !== undefined) {
        this.adapter().pageSize.set(ps);
      }
    });

    effect(() => {
      const pi = this.pageIndex();
      if (pi !== undefined) {
        this.adapter().pageIndex.set(pi);
      }
    });

    effect(() => {
      const items = this.adapter().visibleWindow();
      const gen = ++this.resolveGeneration;
      const rows: (unknown | null)[] = new Array(items.length).fill(null);

      items.forEach((item, index) => {
        if (item instanceof Promise) {
          item.then((resolved) => {
            if (this.resolveGeneration !== gen) return; // stale page
            const current = [...this.resolvedRows()];
            current[index] = resolved;
            this.resolvedRows.set(current);
          });
        } else {
          rows[index] = item;
        }
      });

      this.resolvedRows.set(rows);
    });

    // Keep --ui-total-row-width in sync so header + body + rows
    // all expand to the same width inside the scroll container.
    effect(() => {
      const width = this.totalRowWidth();
      if (width > 0) {
        this.elRef.nativeElement.style.setProperty(
          "--ui-total-row-width",
          `${width}px`,
        );
      } else {
        this.elRef.nativeElement.style.removeProperty("--ui-total-row-width");
      }
    });

    // Sync selection mode into whichever model is active
    effect(() => {
      const mode = this.selectionMode();
      this.selection().mode.set(mode);
    });

    // Emit selectionChange whenever the selection changes
    effect(() => {
      const rows = this.selection().selected();
      this.selectionChange.emit(rows);
    });
  }

  ngOnInit(): void {
    const id = this.tableId();
    if (id) {
      const saved = this.resizeService.load(id);
      if (saved.size > 0) {
        const record: Record<string, number> = {};
        for (const [key, px] of saved) {
          record[key] = px;
        }
        this.columnWidths.set(record);
      }
    }
  }

  ngAfterViewInit(): void {
    this.setupHorizontalScrollSync();
  }

  /**
   * Keeps the header aligned and in sync with the CDK virtual-scroll
   * viewport.
   *
   * Two things are synchronised:
   * 1. **Vertical scrollbar spacer** — the header trailing spacer is set
   *    to the viewport's actual scrollbar width (0 when no scrollbar is
   *    visible) so header and body columns stay pixel-aligned.
   * 2. **Horizontal scroll** — when the body overflows horizontally,
   *    `--ui-header-scroll-width` widens the header row to match, and
   *    `scrollLeft` is mirrored on every scroll event.
   *
   * A {@link ResizeObserver} on the viewport's content wrapper re-runs
   * the sync whenever the body's scrollable area changes (data load,
   * column resize, window resize, etc.).
   */
  private setupHorizontalScrollSync(): void {
    const root = this.elRef.nativeElement;
    const viewport = root.querySelector(
      "cdk-virtual-scroll-viewport",
    ) as HTMLElement | null;
    const header = root.querySelector("ui-table-header") as HTMLElement | null;
    if (!viewport || !header) return;

    const syncHeaderWidth = () => {
      // ── Vertical scrollbar compensation ──
      // Only reserve header-spacer width when the viewport actually
      // displays a scrollbar. The previous probe-based approach always
      // set the platform scrollbar width, even when the content was
      // shorter than the viewport and no scrollbar was visible.
      const verticalSbW = viewport.offsetWidth - viewport.clientWidth;
      root.style.setProperty("--ui-scrollbar-width", `${verticalSbW}px`);

      // ── Horizontal overflow ──
      const sw = viewport.scrollWidth;
      const cw = viewport.clientWidth;
      if (sw > cw) {
        // Body overflows – widen the header row to match.
        const sbW = viewport.offsetWidth - cw;
        header.style.setProperty("--ui-header-scroll-width", `${sw + sbW}px`);
      } else {
        header.style.removeProperty("--ui-header-scroll-width");
      }
    };

    // Initial sync so the spacer is correct before data loads.
    syncHeaderWidth();

    const onScroll = () => {
      syncHeaderWidth();
      header.scrollLeft = viewport.scrollLeft;
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });

    // Observe size changes in the content wrapper so we catch data loads,
    // column resizes, and window resizes without polling.
    const contentWrapper = viewport.querySelector(
      ".cdk-virtual-scroll-content-wrapper",
    );
    let ro: ResizeObserver | undefined;
    if (contentWrapper) {
      ro = new ResizeObserver(() => syncHeaderWidth());
      ro.observe(contentWrapper);
    }

    this.destroyRef.onDestroy(() => {
      viewport.removeEventListener("scroll", onScroll);
      ro?.disconnect();
    });
  }

  /**
   * Handles keyboard navigation within the table.
   *
   * Arrow keys move the active row; Home / End jump to the
   * first / last row. When `selectionMode` is not `'none'`,
   * the active row is automatically selected.
   */
  protected onKeydown(event: KeyboardEvent): void {
    const rows = this.sortedRows();
    if (rows.length === 0) return;

    let idx = this.activeIndex();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        idx = Math.min(idx + 1, rows.length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        idx = Math.max(idx - 1, 0);
        break;
      case "Home":
        event.preventDefault();
        idx = 0;
        break;
      case "End":
        event.preventDefault();
        idx = rows.length - 1;
        break;
      default:
        return;
    }

    this.activeIndex.set(idx);

    const row = rows[idx];
    if (row !== null && this.selectionMode() !== "none") {
      this.selection().select(row);
    }
  }

  /**
   * Force the table to rebuild its internal adapter and re-read data
   * from the current datasource. Call this after mutating the datasource
   * externally (e.g. after calling `filterBy` on a
   * `FilterableArrayDatasource`).
   */
  public refreshDatasource(): void {
    this._adapterVersion.update((v) => v + 1);
  }

  protected onSortChange(state: SortState | null): void {
    this.sortState.set(state);

    // If the datasource supports sorting, delegate to it
    if (this.supportsSorting()) {
      const ds = this.datasource();
      if (isSortableDatasource(ds)) {
        const expression = state
          ? [
              {
                columnKey: state.key as keyof unknown,
                direction:
                  state.direction === "asc"
                    ? SortDirection.Ascending
                    : SortDirection.Descending,
              },
            ]
          : null;
        ds.sortBy(expression);
        this.refreshDatasource();
      }
    }
  }

  protected onPageChange(page: number): void {
    this.adapter().pageIndex.set(page);
  }

  protected onColumnResize(event: ColumnResizeEvent): void {
    const current = { ...this.columnWidths() };
    current[event.key] = event.widthPx;
    this.columnWidths.set(current);

    // Persist to localStorage if we have a tableId
    const id = this.tableId();
    if (id) {
      const map = new Map<string, number>(Object.entries(current));
      this.resizeService.save(id, map);
    }
  }

  protected onRowClick(row: unknown): void {
    if (row === null) return; // still loading

    // Always sync the active-row indicator
    const idx = this.sortedRows().indexOf(row);
    if (idx >= 0) {
      this.activeIndex.set(idx);
    }

    if (this.selectionMode() === "none" || !this.rowClickSelect()) return;
    this.selection().toggle(row);
  }

  protected onSelectAllChange(checked: boolean): void {
    const model = this.selection();
    if (checked) {
      // Only select non-null (loaded) rows
      const rows = this.sortedRows().filter((r) => r !== null);
      model.selectAll(rows);
    } else {
      model.clear();
    }
  }
}
