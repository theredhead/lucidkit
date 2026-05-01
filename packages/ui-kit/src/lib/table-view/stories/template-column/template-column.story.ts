import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITemplateColumn } from "../../columns/template-column/template-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import {
  JsonPlaceholderPostsDatasource,
  type JsonPlaceholderPost,
} from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";
import { UIButton } from "../../../button/button.component";

// ---------------------------------------------------------------------------
// Template column demo
// ---------------------------------------------------------------------------

@Component({
  selector: "ui-table-view-template-col-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UITemplateColumn,
    UIDensityDirective,
    UIButton,
  ],
  templateUrl: "./template-column.story.html",
  styleUrl: "./template-column.story.scss",
})
export class UITableViewTemplateColDemo {
  readonly caption = input("Template Column Demo");
  readonly selectionMode = input<"none" | "single" | "multiple">("none");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly lastAction = signal("Click a button to see the action here…");

  onAction(action: string, row: JsonPlaceholderPost): void {
    this.lastAction.set(
      `${action.toUpperCase()}: ${JSON.stringify({ id: row.id, title: row.title }, null, 2)}`,
    );
  }
}
