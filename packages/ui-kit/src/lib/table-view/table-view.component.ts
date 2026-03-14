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
  signal,
} from "@angular/core";

import { ColumnResizeService } from "./column-resize.service";
import { UITableViewColumn } from "./columns/table-column.directive";
import { DatasourceAdapter } from "./datasources/datasource-adapter";
import { UITableBody } from "./table-view-body.component";
import { UITableFooter } from "./table-view-footer.component";
import {
  ColumnResizeEvent,
  SortState,
  UITableHeader,
} from "./table-view-header.component";

@Component({
  selector: "ui-table-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableHeader, UITableBody, UITableFooter],
  templateUrl: "./table-view.component.html",
  styleUrl: "./table-view.component.scss",
})
export class UITableView implements OnInit, AfterViewInit {
  private static nextCaptionId = 0;
  private readonly resizeService = inject(ColumnResizeService);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  datasource = input.required<DatasourceAdapter<any>>();
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

  columns = contentChildren(UITableViewColumn);
  protected readonly captionId = `ui-table-caption-${UITableView.nextCaptionId++}`;

  protected readonly resolvedRows = signal<unknown[]>([]);
  protected readonly sortState = signal<SortState | null>(null);
  protected readonly captionAriaLabelledBy = computed(() =>
    this.caption().trim() ? this.captionId : null,
  );
  protected readonly rowIndexOffset = computed(
    () => this.datasource().pageIndex() * this.datasource().pageSize(),
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
    const cols = this.columns();
    const widths = this.columnWidths();
    const flexColMinWidth = 120;
    const rowIndexWidth = this.showRowIndexIndicator() ? 68 : 0;

    let total = rowIndexWidth;
    let hasExplicit = false;
    for (const col of cols) {
      const w = widths[col.key()];
      if (w !== undefined) {
        total += w;
        hasExplicit = true;
      } else {
        total += flexColMinWidth;
      }
    }
    return hasExplicit ? total : 0;
  });

  /** Generation counter to discard stale promise resolutions after page changes. */
  private resolveGeneration = 0;

  protected readonly sortedRows = computed(() => {
    const rows = this.resolvedRows();
    const sort = this.sortState();
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
    effect(() => {
      const items = this.datasource().visibleWindow();
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

    // Keep --tv-total-row-width in sync so header + body + rows
    // all expand to the same width inside the scroll container.
    effect(() => {
      const width = this.totalRowWidth();
      if (width > 0) {
        this.elRef.nativeElement.style.setProperty(
          "--tv-total-row-width",
          `${width}px`,
        );
      } else {
        this.elRef.nativeElement.style.removeProperty("--tv-total-row-width");
      }
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
    this.measureScrollbarWidth();
    this.setupHorizontalScrollSync();
  }

  /**
   * Measures the platform scrollbar width using an off-screen probe element.
   * Unlike measuring the live viewport (which may not have a scrollbar yet
   * because data loads asynchronously), this technique gives the correct
   * width immediately regardless of content or timing.
   */
  private measureScrollbarWidth(): void {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden;";
    document.body.appendChild(probe);
    const scrollbarW = probe.offsetWidth - probe.clientWidth;
    document.body.removeChild(probe);

    this.elRef.nativeElement.style.setProperty(
      "--tv-scrollbar-width",
      `${scrollbarW}px`,
    );
  }

  /**
   * Keeps the header in horizontal-scroll sync with the CDK viewport.
   *
   * Uses a ResizeObserver on the viewport's content wrapper to detect
   * whenever the body's scrollable width changes (column resize, data load,
   * natural content overflow, etc.). When the body overflows, we set
   * --tv-header-scroll-width on the header element so its inner row
   * expands to match and scrollLeft works correctly.
   */
  private setupHorizontalScrollSync(): void {
    const root = this.elRef.nativeElement;
    const viewport = root.querySelector(
      "cdk-virtual-scroll-viewport",
    ) as HTMLElement | null;
    const header = root.querySelector("ui-table-header") as HTMLElement | null;
    if (!viewport || !header) return;

    const syncHeaderWidth = () => {
      const sw = viewport.scrollWidth;
      const cw = viewport.clientWidth;
      if (sw > cw) {
        // Body overflows – widen the header row to match.
        // Add the vertical-scrollbar width so header cells stay aligned.
        const sbW = viewport.offsetWidth - cw;
        header.style.setProperty("--tv-header-scroll-width", `${sw + sbW}px`);
      } else {
        header.style.removeProperty("--tv-header-scroll-width");
      }
    };

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

  protected onSortChange(state: SortState | null): void {
    this.sortState.set(state);
  }

  protected onPageChange(page: number): void {
    this.datasource().pageIndex.set(page);
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
}
