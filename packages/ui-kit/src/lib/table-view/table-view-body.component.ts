import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UITableViewColumn } from "./columns/table-column.directive";

@Component({
  selector: "ui-table-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, NgTemplateOutlet],
  template: `
    <cdk-virtual-scroll-viewport
      [itemSize]="rowHeight()"
      class="table-body-viewport"
    >
      <div
        *cdkVirtualFor="let row of rows(); let rowIndex = index"
        class="table-row"
        [class.table-row--loading]="row === null"
        [style.height.px]="rowHeight()"
        [style.min-height.px]="rowHeight()"
      >
        @if (showRowIndexIndicator()) {
          <div class="table-cell table-cell--row-index">
            @if (row !== null) {
              {{ rowIndexOffset() + rowIndex + 1 }}
            }
          </div>
        }
        @for (col of columns(); track col.key()) {
          <div
            class="table-cell"
            [style.width.px]="getColWidth(col.key())"
            [style.min-width.px]="getColWidth(col.key()) ? 40 : null"
            [style.flex]="getColWidth(col.key()) ? '0 0 auto' : '1'"
          >
            @if (row !== null) {
              <ng-container
                [ngTemplateOutlet]="col.cellTemplate"
                [ngTemplateOutletContext]="{ $implicit: row, column: col }"
              />
            } @else {
              <span class="table-cell-skeleton"></span>
            }
          </div>
        }
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .table-body-viewport {
        height: 420px;
        width: 100%;
        background: var(--tv-surface);
        overflow: auto;
      }
      .table-row {
        display: flex;
        min-width: var(--tv-total-row-width, 100%);
        border-bottom: 1px solid var(--tv-border);
        transition: background-color 120ms ease;
      }
      .table-row:hover {
        background: color-mix(in srgb, var(--tv-accent) 7%, transparent);
      }
      .table-cell {
        flex: 1;
        min-width: 0;
        padding: 0 var(--ui-inline-padding, 0.85rem);
        overflow: hidden;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        border-right: 1px solid var(--tv-border);
        color: var(--tv-text);
        font-size: calc(0.9rem * var(--ui-density-scale, 1));
      }
      .table-cell:last-child {
        border-right: none;
      }
      .table-cell--row-index {
        flex: 0 0 var(--tv-row-index-width, 4.25rem);
        width: var(--tv-row-index-width, 4.25rem);
        min-width: var(--tv-row-index-width, 4.25rem);
        max-width: var(--tv-row-index-width, 4.25rem);
        justify-content: flex-end;
        color: var(--tv-muted);
        font-variant-numeric: tabular-nums;
      }

      /* ── Skeleton / loading rows ── */
      .table-row--loading {
        pointer-events: none;
      }
      .table-row--loading:hover {
        background: transparent;
      }
      .table-cell-skeleton {
        display: block;
        width: var(--tv-skeleton-width, 60%);
        height: var(--tv-skeleton-height, 0.75rem);
        border-radius: var(--tv-skeleton-radius, 4px);
        background: var(
          --tv-skeleton-bg,
          linear-gradient(
            90deg,
            var(--tv-border) 25%,
            color-mix(in srgb, var(--tv-border) 40%, transparent) 50%,
            var(--tv-border) 75%
          )
        );
        background-size: 200% 100%;
        animation: tv-skeleton-shimmer var(--tv-skeleton-duration, 1.5s)
          ease-in-out infinite;
      }
      /* Vary skeleton bar widths per column for a natural look */
      .table-row--loading .table-cell:nth-child(odd) .table-cell-skeleton {
        width: var(--tv-skeleton-width-odd, 45%);
      }
      .table-row--loading .table-cell:nth-child(even) .table-cell-skeleton {
        width: var(--tv-skeleton-width-even, 70%);
      }
      @keyframes tv-skeleton-shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class UITableBody {
  columns = input.required<readonly UITableViewColumn[]>();
  rows = input.required<readonly unknown[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexOffset = input<number>(0);
  rowHeight = input<number>(36);
  columnWidths = input<Record<string, number>>({});

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }
}
