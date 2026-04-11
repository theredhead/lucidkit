import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { DEFAULT_ROW_HEIGHT, MIN_COLUMN_WIDTH } from "../table-view.constants";
import type { SelectionMode, SelectionModel } from "../../core/selection-model";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/lucid-foundation";

@Component({
  selector: "ui-table-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "table-body" }],
  imports: [ScrollingModule, NgTemplateOutlet],
  templateUrl: "./table-view-body.component.html",
  styleUrl: "./table-view-body.component.scss",
})
/** @internal */
export class UITableBody {
  columns = input.required<readonly UITableViewColumn[]>();
  rows = input.required<readonly unknown[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexOffset = input<number>(0);
  rowHeight = input<number>(DEFAULT_ROW_HEIGHT);
  columnWidths = input<Record<string, number>>({});
  selectionMode = input<SelectionMode>("none");
  showSelectionColumn = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selection = input<SelectionModel<any> | undefined>(undefined);
  rowClickSelect = input<boolean>(false);

  /** Index of the currently active (keyboard-focused) row, or −1 when none. */
  activeIndex = input<number>(-1);

  rowClick = output<unknown>();

  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

  public constructor() {
    // Scroll the active row into view when it changes
    effect(() => {
      const idx = this.activeIndex();
      const vp = this.viewport();
      if (idx < 0 || !vp) return;

      const itemSize = this.rowHeight();
      const viewportSize = vp.getViewportSize();
      if (viewportSize <= 0) return;

      const scrollTop = vp.measureScrollOffset("top");
      const rowTop = idx * itemSize;
      const rowBottom = rowTop + itemSize;

      if (rowTop < scrollTop) {
        vp.scrollToOffset(rowTop);
      } else if (rowBottom > scrollTop + viewportSize) {
        vp.scrollToOffset(rowBottom - viewportSize);
      }
    });
  }

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }

  protected onRowClick(row: unknown): void {
    if (row === null) return;
    this.rowClick.emit(row);
  }

  protected onSelectionToggle(row: unknown): void {
    if (row === null) return;
    this.selection()?.toggle(row);
  }

  protected isRowSelected(row: unknown): boolean {
    if (row === null) return false;
    return this.selection()?.isSelected(row) ?? false;
  }
}
