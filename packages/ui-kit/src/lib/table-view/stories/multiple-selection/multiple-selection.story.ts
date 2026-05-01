import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import {
  JsonPlaceholderPostsDatasource,
  type JsonPlaceholderPost,
} from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";
import { SelectionModel } from "../../../core/selection-model";

@Component({
  selector: "ui-table-view-multi-select-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./multiple-selection.story.html",
  styleUrl: "./multiple-selection.story.scss",
})
export class UITableViewMultiSelectDemo {
  readonly caption = input("Multiple Selection");
  readonly selectionMode = input<"none" | "single" | "multiple">("multiple");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(true);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly selectionModel = new SelectionModel<JsonPlaceholderPost>(
    "multiple",
    (row) => row.id,
  );
  readonly selectedJson = signal("(none)");
  readonly selectedCount = signal(0);

  onSelectionChange(rows: readonly unknown[]): void {
    const selectedRows = rows as readonly JsonPlaceholderPost[];

    this.selectedCount.set(rows.length);
    this.selectedJson.set(
      selectedRows.length > 0
        ? JSON.stringify(
            selectedRows.map((row) => ({ id: row.id, title: row.title })),
            null,
            2,
          )
        : "(none)",
    );
  }
}
