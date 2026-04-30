import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { JsonPlaceholderPostsDatasource } from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";
import { type SelectionMode } from "../../../core/selection-model";

@Component({
  selector: "ui-table-view-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
  ],
  templateUrl: "./json-placeholder-posts.story.html",
})
export class UITableViewStoryDemo {
  readonly caption = input<string>("JSONPlaceholder Posts");
  readonly selectionMode = input<SelectionMode>("none");
  readonly showBuiltInPaginator = input<boolean>(true);
  readonly showRowIndexIndicator = input<boolean>(true);
  readonly showSelectionColumn = input<boolean>(true);
  readonly rowClickSelect = input<boolean>(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input<boolean>(false);

  readonly adapter = new JsonPlaceholderPostsDatasource(25);
}
