import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  NgZone,
  output,
  signal,
} from "@angular/core";

import { UITableViewColumn } from "./columns/table-column.directive";

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

export interface ColumnResizeEvent {
  key: string;
  widthPx: number;
}

@Component({
  selector: "ui-table-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-header-row">
      @if (showRowIndexIndicator()) {
        <div class="table-header-cell table-header-cell--row-index">
          {{ rowIndexHeaderText() }}
        </div>
      }
      @for (col of columns(); track col.key(); let i = $index) {
        <div
          class="table-header-cell"
          [class.sortable]="col.sortable()"
          [style.width.px]="getColWidth(col.key())"
          [style.min-width.px]="getColWidth(col.key()) ? 40 : null"
          [style.flex]="getColWidth(col.key()) ? '0 0 auto' : '1'"
          (click)="onCellClick(col)"
        >
          <span class="header-label">{{ col.headerText() || col.key() }}</span>
          @if (col.sortable()) {
            <span class="sort-icon">
              @if (sortState()?.key === col.key()) {
                {{ sortState()!.direction === "asc" ? "↑" : "↓" }}
              } @else {
                <span class="sort-icon--inactive">⇅</span>
              }
            </span>
          }
          @if (resizable()) {
            <span
              class="resize-handle"
              (pointerdown)="onResizeStart($event, col.key())"
            ></span>
          }
        </div>
      }
      <div class="header-scrollbar-spacer" aria-hidden="true"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
      .table-header-row {
        display: flex;
        min-width: var(
          --tv-header-scroll-width,
          var(--tv-total-row-width, 100%)
        );
        background: var(--tv-surface-2);
        border-bottom: 1px solid var(--tv-border);
      }
      .table-header-cell {
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        padding: var(--ui-block-padding, 0.65rem)
          var(--ui-inline-padding, 0.85rem);
        font-weight: 600;
        font-size: calc(0.74rem * var(--ui-density-scale, 1));
        color: var(--tv-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        display: flex;
        align-items: center;
        gap: calc(var(--ui-gap, 0.75rem) * 0.6);
        border-right: 1px solid var(--tv-border);
        transition:
          background-color 120ms ease,
          color 120ms ease;
        position: relative;
      }
      .table-header-cell:has(+ .header-scrollbar-spacer) {
        border-right: none;
      }
      .header-scrollbar-spacer {
        flex: 0 0 var(--tv-scrollbar-width, 0px);
      }
      .table-header-cell--row-index {
        flex: 0 0 var(--tv-row-index-width, 4.25rem);
        width: var(--tv-row-index-width, 4.25rem);
        min-width: var(--tv-row-index-width, 4.25rem);
        max-width: var(--tv-row-index-width, 4.25rem);
        justify-content: flex-end;
        color: var(--tv-text);
      }
      .header-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .table-header-cell.sortable {
        cursor: pointer;
        user-select: none;
      }
      .table-header-cell.sortable:hover {
        background: color-mix(in srgb, var(--tv-accent) 9%, transparent);
        color: var(--tv-text);
      }
      .sort-icon {
        margin-left: auto;
        font-size: 0.82rem;
        line-height: 1;
      }
      .sort-icon--inactive {
        opacity: 0.35;
      }

      /* ── Resize handle ── */
      .resize-handle {
        position: absolute;
        top: 0;
        right: -3px;
        width: 6px;
        height: 100%;
        cursor: col-resize;
        z-index: 2;
        user-select: none;
        touch-action: none;
      }
      .resize-handle::after {
        content: "";
        position: absolute;
        top: 25%;
        right: 2px;
        width: 2px;
        height: 50%;
        border-radius: 1px;
        background: var(--tv-border-strong);
        opacity: 0;
        transition: opacity 150ms ease;
      }
      .table-header-cell:hover .resize-handle::after,
      .resize-handle:hover::after {
        opacity: 1;
      }
      :host-context(.tv-resizing) .resize-handle::after {
        opacity: 1;
        background: var(--tv-accent);
      }
    `,
  ],
})
export class UITableHeader {
  columns = input.required<readonly UITableViewColumn[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexHeaderText = input<string>("#");
  resizable = input<boolean>(false);
  columnWidths = input<Record<string, number>>({});
  sortChange = output<SortState | null>();
  columnResize = output<ColumnResizeEvent>();
  sortState = signal<SortState | null>(null);

  constructor(
    private readonly elRef: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
  ) {}

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }

  onCellClick(col: UITableViewColumn): void {
    if (!col.sortable()) return;
    const current = this.sortState();
    let next: SortState | null;
    if (current?.key === col.key()) {
      next =
        current.direction === "asc"
          ? { key: col.key(), direction: "desc" }
          : null;
    } else {
      next = { key: col.key(), direction: "asc" };
    }
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  onResizeStart(event: PointerEvent, colKey: string): void {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.target as HTMLElement;
    const cell = handle.parentElement!;
    const startX = event.clientX;
    const startWidth = cell.getBoundingClientRect().width;
    const minWidth = 40;
    const root =
      this.elRef.nativeElement.closest(".table-view-root") ??
      this.elRef.nativeElement;

    root.classList.add("tv-resizing");
    handle.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
      const delta = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.round(startWidth + delta));
      cell.style.width = `${newWidth}px`;
      cell.style.flex = "0 0 auto";
    };

    const onUp = (e: PointerEvent) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      root.classList.remove("tv-resizing");

      const finalWidth = Math.max(
        minWidth,
        Math.round(cell.getBoundingClientRect().width),
      );
      this.zone.run(() => {
        this.columnResize.emit({ key: colKey, widthPx: finalWidth });
      });
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  }
}
