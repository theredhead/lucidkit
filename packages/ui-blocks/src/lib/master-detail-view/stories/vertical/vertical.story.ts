import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  FilterableArrayDatasource,
  UIBadgeColumn,
  UITextColumn,
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
];

// ── Demo component ────────────────────────────────────────────────────

@Component({
  selector: "ui-mdv-vertical-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn, UIBadgeColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./vertical.story.scss",
  templateUrl: "./vertical.story.html",
})
export class VerticalDemo {
  protected readonly adapter = new FilterableArrayDatasource(EMPLOYEES);
  protected readonly selected = signal<Employee | undefined>(undefined);
}
