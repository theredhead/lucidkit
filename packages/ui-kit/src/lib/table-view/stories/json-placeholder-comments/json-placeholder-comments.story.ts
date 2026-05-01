import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIDensity, UIDensityDirective } from "../../../ui-density";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { JsonPlaceholderCommentsDatasource } from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";

@Component({
  selector: "ui-table-view-comments-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UINumberColumn, UITextColumn, UIDensityDirective],
  templateUrl: "./json-placeholder-comments.story.html",
})
export class UITableViewCommentsStoryDemo {
  readonly density = input<UIDensity>("compact");
  readonly caption = input("JSONPlaceholder Comments");
  readonly selectionMode = input<"none" | "single" | "multiple">("none");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly adapter = new JsonPlaceholderCommentsDatasource(25);
}
