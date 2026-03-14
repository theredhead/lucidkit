import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UITableViewColumn } from "../columns/table-column.directive";
import { DEFAULT_ROW_HEIGHT, MIN_COLUMN_WIDTH } from "../table-view.constants";

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

  protected readonly minColumnWidth = MIN_COLUMN_WIDTH;

  protected getColWidth(key: string): number | null {
    return this.columnWidths()[key] ?? null;
  }
}
