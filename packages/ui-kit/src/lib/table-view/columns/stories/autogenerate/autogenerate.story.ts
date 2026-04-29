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
  selector: "ui-demo-autogenerate",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./autogenerate.story.html",
})
export class DemoAutogenerateComponent {
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
      {
        id: 3,
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
      },
      {
        id: 4,
        firstName: "Alice",
        lastName: "Williams",
        email: "alice@example.com",
      },
      {
        id: 5,
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@example.com",
      },
    ]),
  );
}
