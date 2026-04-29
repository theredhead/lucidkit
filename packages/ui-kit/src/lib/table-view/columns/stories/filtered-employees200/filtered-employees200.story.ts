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

// ── Large data generators ───────────────────────────────────────────

const firstNames = [
  "James",
  "Mary",
  "Robert",
  "Patricia",
  "John",
  "Jennifer",
  "Michael",
  "Linda",
  "David",
  "Elizabeth",
  "William",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
];

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Legal",
  "Design",
  "Product",
  "Operations",
  "Support",
];

const statuses = ["Active", "On Leave", "Probation", "Contractor", "Remote"];

function generateEmployees(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[(i * 7 + 3) % lastNames.length];
    return {
      employeeId: 1000 + i,
      firstName: first,
      lastName: last,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@acme.com`,
      department: departments[i % departments.length],
      salary: 45000 + ((i * 1337) % 85000),
      startDate: `${2018 + (i % 8)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      status: statuses[i % statuses.length],
    };
  });
}

// ── Filtered + autogenerate demo components ─────────────────────────

const employeesForFilter = generateEmployees(200);

const employeeFilterFields = inferFilterFields(employeesForFilter[0]);

@Component({
  selector: "ui-demo-autogenerate-filtered",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITableView, UIAutogenerateColumnsDirective, UIFilter],
  templateUrl: "./filtered-employees200.story.html",
})
export class DemoAutogenerateFilteredComponent {
  public readonly fields = employeeFilterFields;
  public readonly datasource = new FilterableArrayDatasource(
    employeesForFilter,
  );
  private readonly table = viewChild.required(UITableView);

  public onExpressionChange(
    expression: FilterExpression<Record<string, unknown>>,
  ): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}
