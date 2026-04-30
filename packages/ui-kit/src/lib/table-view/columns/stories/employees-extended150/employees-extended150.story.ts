import { Component, signal } from "@angular/core";
import { UITableView } from "../../../table-view.component";
import { UIAutogenerateColumnsDirective } from "../../autogenerate-columns.directive";
import { ArrayDatasource } from "../../../datasources/array-datasource";

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

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
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

@Component({
  selector: "ui-demo-autogenerate-employees-city",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  templateUrl: "./employees-extended150.story.html",
})
export class DemoAutogenerateEmployeesCityComponent {
  public readonly datasource = signal(
    new ArrayDatasource(
      generateEmployees(150).map((e, i) => ({
        ...e,
        city: cities[i % cities.length],
        floor: (i % 12) + 1,
        extension: 2000 + i,
      })),
    ),
  );
  public readonly config = signal({
    excludeKeys: ["employeeId"],
    headerMap: {
      firstName: "First",
      lastName: "Last",
      startDate: "Hire Date",
    },
  });
}
