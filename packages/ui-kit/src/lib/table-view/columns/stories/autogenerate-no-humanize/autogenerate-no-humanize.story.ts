import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";

import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";
import { FilterableArrayDatasource } from "../../../datasources/filterable-array-datasource";
import { UIFilter } from "../../../../filter/filter.component";
import { inferFilterFields } from "../../../../filter/infer-filter-fields";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../../../filter/filter.types";

@Component({
  selector: "ui-demo-autogenerate-no-humanize",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./autogenerate-no-humanize.story.html",
})
export class DemoAutogenerateNoHumanizeComponent {
  public readonly datasource = signal(
    new ArrayDatasource([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
    ]),
  );
}
