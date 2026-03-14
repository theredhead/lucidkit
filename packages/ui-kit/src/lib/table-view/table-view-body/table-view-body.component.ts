import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { DEFAULT_ROW_HEIGHT, MIN_COLUMN_WIDTH } from "../table-view.constants";
import type { SelectionMode, TableSelectionModel } from "../table-view-selection.model";

@Component({
  selector: "ui-table-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollingModule, NgTemplateOutlet],
  templateUrl: "./table-view-body.component.html",
  styleUrl: "./table-view-body.component.scss",
})
export class UITableBody {
  columns = input.required<readonly UITableViewColumn[]>();
  rows = input.required<readonly unknown[]>();
  showRowIndexIndicator = input<boolean>(false);
  rowIndexOffset = input<number>(0);
  rowHeight = input<number>(DEFAULT_ROW_HEIGHT);
  columnWidths = input<Record<string, number>>({});
  selectionMode = input<SelectionMode>("none");
  selection = input<TableSelectionModel<any> | undefined>(undefined);
  rowClickSelect = input<boolean>(false);
  rowClick = output<unknown>();

  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

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
