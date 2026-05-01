import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
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
import { UITemplateColumn } from "../../columns/template-column/template-column.component";
import { UITextColumn } from "../../columns/text-column/text-column.component";
import { FilterableArrayDatasource } from "../../datasources/filterable-array-datasource";
import { UITableView } from "../../table-view.component";
import { SelectionModel } from "../../../core/selection-model";
import { UIButton } from "../../../button/button.component";

// ---------------------------------------------------------------------------
// Local data demo (filter + multi-select + template column + density toggle)
// ---------------------------------------------------------------------------

interface DemoRow {
  id: number;
  name: string;
  email: string;
  age: number;
  status: string;
}

const DEMO_ROWS: DemoRow[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 30,
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 25,
    status: "inactive",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 35,
    status: "active",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    age: 28,
    status: "pending",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    age: 32,
    status: "active",
  },
  {
    id: 6,
    name: "Diana Miller",
    email: "diana@example.com",
    age: 27,
    status: "inactive",
  },
  {
    id: 7,
    name: "Ethan Davis",
    email: "ethan@example.com",
    age: 31,
    status: "pending",
  },
  {
    id: 8,
    name: "Fiona Garcia",
    email: "fiona@example.com",
    age: 29,
    status: "active",
  },
];

const DEMO_FILTER_FIELDS: FilterFieldDefinition<DemoRow>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "status", label: "Status", type: "string" },
];

@Component({
  selector: "ui-table-view-local-data-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UITemplateColumn,
    UIDensityDirective,
    UIButton,
    UIFilter,
  ],
  templateUrl: "./local-data-demo.story.html",
  styleUrl: "./local-data-demo.story.scss",
})
export class UITableViewLocalDataDemo {
  readonly caption = input("Team Members");
  readonly selectionMode = input<"none" | "single" | "multiple">("none");
  readonly showBuiltInPaginator = input(true);
  readonly showRowIndexIndicator = input(true);
  readonly showSelectionColumn = input(true);
  readonly rowClickSelect = input(true);
  readonly pageSize = input<number | undefined>(undefined);
  readonly disabled = input(false);

  readonly filterFields = DEMO_FILTER_FIELDS;
  readonly datasource = new FilterableArrayDatasource(DEMO_ROWS);
  readonly density = signal<UIDensity>("comfortable");
  readonly statusLine = signal("Select rows or click View to see output here…");
  readonly selectionModel = computed(
    () => new SelectionModel<DemoRow>(this.selectionMode(), (row) => row.id),
  );

  private readonly table = viewChild.required(UITableView);

  onExpressionChange(expression: FilterExpression<DemoRow>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }

  onSelectionChange(rows: readonly unknown[]): void {
    const count = rows.length;
    this.statusLine.set(
      count > 0
        ? `${count} row${count === 1 ? "" : "s"} selected: ${(rows as DemoRow[]).map((r) => r.name).join(", ")}`
        : "No rows selected.",
    );
  }

  onAction(row: DemoRow): void {
    this.statusLine.set(
      `View clicked: ${JSON.stringify({ id: row.id, name: row.name, status: row.status }, null, 2)}`,
    );
  }

  toggleDensity(): void {
    const cycle: Record<UIDensity, UIDensity> = {
      small: "compact",
      compact: "comfortable",
      comfortable: "generous",
      generous: "small",
    };
    this.density.update((d) => cycle[d]);
  }
}
