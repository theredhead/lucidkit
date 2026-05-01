import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIDensity, UIDensityDirective } from "../../../ui-density";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { JsonPlaceholderPhotosDatasource } from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";

@Component({
  selector: "ui-table-view-photos-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UINumberColumn, UITextColumn, UIDensityDirective],
  templateUrl: "./json-placeholder-photos.story.html",
})
export class UITableViewPhotosStoryDemo {
  readonly density = input<UIDensity>("generous");
  readonly caption = input("JSONPlaceholder Photos");
  readonly selectionMode = input<"none" | "single" | "multiple">("none");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly adapter = new JsonPlaceholderPhotosDatasource(25);
}
