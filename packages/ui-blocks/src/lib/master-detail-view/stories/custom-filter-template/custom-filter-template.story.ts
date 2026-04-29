import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import {
  ArrayTreeDatasource,
  FilterableArrayDatasource,
  UIAvatar,
  UIFilter,
  UITemplateColumn,
  UITextColumn,
  type FilterFieldDefinition,
  type FilterDescriptor,
  type FilterExpression,
  type TreeNode,
} from "@theredhead/lucid-kit";

import { UIMasterDetailView } from "../../master-detail-view.component";

// ── Sample data ──────────────────────────────────────────────────────

interface Employee {
  name: string;
  email: string;
  department: string;
  role: string;
  joined: string;
}

const EMPLOYEES: Employee[] = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Lead",
    joined: "2021-03-15",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Design",
    role: "Senior",
    joined: "2022-01-10",
  },
  {
    name: "Charlie Lee",
    email: "charlie@example.com",
    department: "Engineering",
    role: "Junior",
    joined: "2023-06-01",
  },
  {
    name: "Diana Patel",
    email: "diana@example.com",
    department: "Product",
    role: "Manager",
    joined: "2020-11-20",
  },
  {
    name: "Ethan Kim",
    email: "ethan@example.com",
    department: "Engineering",
    role: "Senior",
    joined: "2022-08-14",
  },
  {
    name: "Fiona Davis",
    email: "fiona@example.com",
    department: "Design",
    role: "Lead",
    joined: "2019-05-03",
  },
  {
    name: "George Nguyen",
    email: "george@example.com",
    department: "Marketing",
    role: "Junior",
    joined: "2024-02-28",
  },
  {
    name: "Hannah Brown",
    email: "hannah@example.com",
    department: "Product",
    role: "Senior",
    joined: "2021-09-12",
  },
  {
    name: "Ivan Torres",
    email: "ivan@example.com",
    department: "Engineering",
    role: "Senior",
    joined: "2020-04-07",
  },
  {
    name: "Julia Chen",
    email: "julia@example.com",
    department: "Design",
    role: "Junior",
    joined: "2023-11-18",
  },
  {
    name: "Kevin Müller",
    email: "kevin@example.com",
    department: "Marketing",
    role: "Manager",
    joined: "2019-08-25",
  },
  {
    name: "Laura Rossi",
    email: "laura@example.com",
    department: "Engineering",
    role: "Junior",
    joined: "2024-01-09",
  },
  {
    name: "Marcus Andersen",
    email: "marcus@example.com",
    department: "Product",
    role: "Lead",
    joined: "2018-12-03",
  },
  {
    name: "Nadia Okafor",
    email: "nadia@example.com",
    department: "Engineering",
    role: "Manager",
    joined: "2020-07-22",
  },
  {
    name: "Oscar Petrov",
    email: "oscar@example.com",
    department: "Design",
    role: "Senior",
    joined: "2021-05-30",
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    department: "Marketing",
    role: "Senior",
    joined: "2022-10-14",
  },
  {
    name: "Quinn Yamamoto",
    email: "quinn@example.com",
    department: "Product",
    role: "Junior",
    joined: "2023-03-19",
  },
  {
    name: "Rachel Dubois",
    email: "rachel@example.com",
    department: "Engineering",
    role: "Lead",
    joined: "2019-01-28",
  },
];

// ── Demo: With Custom Filter Template ────────────────────────────────

const FILTER_FIELDS: FilterFieldDefinition<Employee>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "department", label: "Department", type: "string" },
  { key: "role", label: "Role", type: "string" },
];

@Component({
  selector: "ui-mdv-custom-filter-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn, UIFilter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./custom-filter-template.story.scss",
  templateUrl: "./custom-filter-template.story.html",
})
export class CustomFilterDemo {
  protected readonly fields = FILTER_FIELDS;
  protected readonly employees = EMPLOYEES;
  protected readonly filterDescriptor = signal<FilterDescriptor<Employee>>({
    junction: "and",
    rules: [],
  });

  private readonly datasource = new FilterableArrayDatasource(EMPLOYEES);
  protected readonly adapter = this.datasource;

  protected onExpression(expression: FilterExpression<Employee>): void {
    this.datasource.filterBy(expression);
  }
}
