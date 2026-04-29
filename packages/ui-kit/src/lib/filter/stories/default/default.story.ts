import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";

import { UIFilter } from "../../filter.component";
import type { FilterExpression, FilterFieldDefinition } from "../../filter.types";

// ---------------------------------------------------------------------------
// Demo wrapper — shows the filter builder + live JSON output
// ---------------------------------------------------------------------------

interface DemoRow {
  name: string;
  age: number;
  email: string;
  salary: number;
  hireDate: string;
}

const DEMO_FIELDS: FilterFieldDefinition<DemoRow>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "salary", label: "Salary", type: "number" },
  { key: "hireDate", label: "Hire Date", type: "date" },
];

@Component({
  selector: "ui-filter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIFilter, JsonPipe],
  templateUrl: "./default.story.html",
})
export class UIFilterStoryDemo {
  readonly fields = DEMO_FIELDS;
  readonly allowJunction = signal(false);
  readonly descriptor = signal<FilterExpression<DemoRow>>({
    junction: "and",
    rules: [],
  });
}
