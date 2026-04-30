import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UIDensityDirective } from "../../../ui-density";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { JsonPlaceholderPhotosDatasource } from "../../datasources/jsonplaceholder-datasource";
import { UITableView } from "../../table-view.component";

@Component({
  selector: "ui-table-view-photos-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIDensityDirective,
  ],
  templateUrl: "./json-placeholder-photos.story.html",
})
export class UITableViewPhotosStoryDemo {
  readonly adapter = new JsonPlaceholderPhotosDatasource(25);
}
