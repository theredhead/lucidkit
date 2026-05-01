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
  selector: "ui-table-view-single-select-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./single-selection.story.html",
  styleUrl: "./single-selection.story.scss",
})
export class UITableViewSingleSelectDemo {
  readonly caption = input("Single Selection");
  readonly selectionMode = input<"none" | "single" | "multiple">("single");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(true);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly selectionModel = new SelectionModel<JsonPlaceholderPost>(
    "single",
    (row) => row.id,
  );
  readonly selectedJson = signal("(none)");

  onSelectionChange(rows: readonly unknown[]): void {
    const [selectedRow] = rows as readonly JsonPlaceholderPost[];

    this.selectedJson.set(
      selectedRow ? JSON.stringify(selectedRow, null, 2) : "(none)",
    );
  }
}
