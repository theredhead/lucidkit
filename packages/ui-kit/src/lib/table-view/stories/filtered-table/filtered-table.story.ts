import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { UIFilter } from "../../../filter/filter.component";
import type { FilterExpression, FilterFieldDefinition } from "../../../filter/filter.types";
import { UIDensityDirective } from "../../../ui-density";
import { UIBadgeColumn } from "../../columns/badge-column/badge-column.component";
import { UINumberColumn } from "../../columns/number-column/number-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { FilterableArrayDatasource } from "../../datasources/filterable-array-datasource";
import { UITableView } from "../../table-view.component";

// ---------------------------------------------------------------------------
// Filtered table demo
// ---------------------------------------------------------------------------

interface Employee {
  id: number;
  name: string;
  department: string;
  age: number;
  salary: number;
  hireDate: string;
}

const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "Engineering",
    age: 32,
    salary: 95_000,
    hireDate: "2019-03-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Marketing",
    age: 28,
    salary: 72_000,
    hireDate: "2021-07-01",
  },
  {
    id: 3,
    name: "Carol Williams",
    department: "Engineering",
    age: 45,
    salary: 120_000,
    hireDate: "2015-01-10",
  },
  {
    id: 4,
    name: "David Brown",
    department: "Sales",
    age: 38,
    salary: 88_000,
    hireDate: "2018-11-20",
  },
  {
    id: 5,
    name: "Eve Davis",
    department: "Engineering",
    age: 26,
    salary: 78_000,
    hireDate: "2023-02-28",
  },
  {
    id: 6,
    name: "Frank Miller",
    department: "HR",
    age: 41,
    salary: 82_000,
    hireDate: "2017-06-14",
  },
  {
    id: 7,
    name: "Grace Wilson",
    department: "Marketing",
    age: 34,
    salary: 76_000,
    hireDate: "2020-09-03",
  },
  {
    id: 8,
    name: "Henry Moore",
    department: "Sales",
    age: 29,
    salary: 71_000,
    hireDate: "2022-04-18",
  },
  {
    id: 9,
    name: "Ivy Taylor",
    department: "Engineering",
    age: 37,
    salary: 105_000,
    hireDate: "2016-08-22",
  },
  {
    id: 10,
    name: "Jack Anderson",
    department: "HR",
    age: 52,
    salary: 98_000,
    hireDate: "2012-12-05",
  },
  {
    id: 11,
    name: "Karen Thomas",
    department: "Engineering",
    age: 30,
    salary: 91_000,
    hireDate: "2021-01-11",
  },
  {
    id: 12,
    name: "Leo Martinez",
    department: "Sales",
    age: 35,
    salary: 84_000,
    hireDate: "2019-10-30",
  },
  {
    id: 13,
    name: "Mia Garcia",
    department: "Marketing",
    age: 27,
    salary: 68_000,
    hireDate: "2023-06-07",
  },
  {
    id: 14,
    name: "Noah Robinson",
    department: "Engineering",
    age: 43,
    salary: 115_000,
    hireDate: "2014-05-19",
  },
  {
    id: 15,
    name: "Olivia Clark",
    department: "HR",
    age: 39,
    salary: 86_000,
    hireDate: "2018-03-25",
  },
];

const EMPLOYEE_FIELDS: FilterFieldDefinition<Employee>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "department", label: "Department", type: "string" },
  { key: "age", label: "Age", type: "number" },
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
})
export class UITableViewFilteredDemo {
  readonly fields = EMPLOYEE_FIELDS;
  readonly datasource = new FilterableArrayDatasource(EMPLOYEES);
  private readonly table = viewChild.required(UITableView);

  onExpressionChange(expression: FilterExpression<Employee>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}
