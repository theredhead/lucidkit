import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from "@angular/core";
import { UIFilter } from "../../../filter/filter.component";
import type {
  FilterExpression,
  FilterFieldDefinition,
} from "../../../filter/filter.types";
import { UIDensity, UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { FilterableArrayDatasource } from "../../datasources/filterable-array-datasource";
import { UITableView } from "../../table-view.component";
import { SelectionModel } from "../../../core/selection-model";

// ---------------------------------------------------------------------------
// Filtered table demo
// ---------------------------------------------------------------------------

interface Employee {
  id: number;
  name: string;
  department: string;
  region: string;
  age: number;
  tenureYears: number;
  salary: number;
  hireDate: string;
}

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Carol",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Karen",
  "Leo",
  "Mia",
  "Noah",
  "Olivia",
  "Priya",
  "Quinn",
  "Riley",
  "Sophia",
  "Theo",
] as const;

const LAST_NAMES = [
  "Johnson",
  "Smith",
  "Williams",
  "Brown",
  "Davis",
  "Miller",
  "Wilson",
  "Moore",
  "Taylor",
  "Anderson",
  "Thomas",
  "Martinez",
  "Garcia",
  "Robinson",
  "Clark",
  "Lewis",
  "Walker",
  "Hall",
  "Young",
  "Allen",
] as const;

const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Support",
  "Design",
] as const;

const REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Middle East",
  "Africa",
  "Asia Pacific",
] as const;

function formatIsoDate(year: number, month: number, day: number): string {
  return [
    year.toString().padStart(4, "0"),
    month.toString().padStart(2, "0"),
    day.toString().padStart(2, "0"),
  ].join("-");
}

function createEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastName =
      LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
    const department = DEPARTMENTS[index % DEPARTMENTS.length];
    const region =
      REGIONS[Math.floor(index / DEPARTMENTS.length) % REGIONS.length];
    const age = 22 + (index % 43);
    const tenureYears = index % 16;
    const hireYear = 2009 + (index % 16);
    const hireMonth = (index % 12) + 1;
    const hireDay = (index % 28) + 1;
    const salary =
      52_000 +
      DEPARTMENTS.indexOf(department) * 8_500 +
      tenureYears * 2_750 +
      (index % 9) * 1_250;

    return {
      id,
      name: `${firstName} ${lastName}`,
      department,
      region,
      age,
      tenureYears,
      salary,
      hireDate: formatIsoDate(hireYear, hireMonth, hireDay),
    };
  });
}

const EMPLOYEES: Employee[] = createEmployees(10_000);

const EMPLOYEE_FIELDS: FilterFieldDefinition<Employee>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "department", label: "Department", type: "string" },
  { key: "region", label: "Region", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "tenureYears", label: "Tenure", type: "number" },
  { key: "salary", label: "Salary", type: "number" },
  { key: "hireDate", label: "Hire Date", type: "date" },
];

@Component({
  selector: "ui-table-view-filtered-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UIFilter,
  ],
  templateUrl: "./filtered-table.story.html",
  styleUrl: "./filtered-table.story.scss",
})
export class UITableViewFilteredDemo {
  readonly density = input<UIDensity>("comfortable");
  readonly caption = input("Employees");
  readonly selectionMode = input<"none" | "single" | "multiple">("single");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(false);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly fields = EMPLOYEE_FIELDS;
  readonly datasource = new FilterableArrayDatasource(EMPLOYEES);
  readonly selectionModel = computed(
    () => new SelectionModel<Employee>(this.selectionMode(), (row) => row.id),
  );
  private readonly table = viewChild.required(UITableView);

  onExpressionChange(expression: FilterExpression<Employee>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}
