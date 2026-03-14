import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { JsonPipe } from "@angular/common";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIFilter } from "./filter.component";
import type { FilterDescriptor, FilterFieldDefinition } from "./filter.types";

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
  template: `
    <ui-filter
      [fields]="fields"
      [allowJunction]="allowJunction()"
      [(value)]="descriptor"
    />
    <pre
      style="margin-top:1rem;font-size:0.8125rem;background:var(--tv-surface-2,#fbfbfc);color:var(--tv-text,#1d232b);border:1px solid var(--tv-border,#d7dce2);padding:0.75rem;border-radius:0;overflow-x:auto;font-family:var(--tv-font,monospace);"
      >{{ descriptor() | json }}</pre
    >
  `,
})
class UIFilterStoryDemo {
  readonly fields = DEMO_FIELDS;
  readonly allowJunction = signal(false);
  readonly descriptor = signal<FilterDescriptor<DemoRow>>({
    junction: "and",
    rules: [],
  });
}

// ---------------------------------------------------------------------------
// Story meta
// ---------------------------------------------------------------------------

const meta: Meta<UIFilterStoryDemo> = {
  title: "@Sigmax/UI Kit/Filter",
  component: UIFilterStoryDemo,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [UIFilter],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIFilterStoryDemo>;

/** Basic AND-only filter builder. */
export const Default: Story = {};

/** With junction toggle (AND / OR). */
export const WithJunction: Story = {
  render: () => ({
    template: `
      <ui-filter
        [fields]="fields"
        [allowJunction]="true"
        [(value)]="descriptor"
      />
      <pre style="margin-top:1rem;font-size:0.8125rem;background:var(--tv-surface-2,#fbfbfc);color:var(--tv-text,#1d232b);border:1px solid var(--tv-border,#d7dce2);padding:0.75rem;overflow-x:auto;font-family:var(--tv-font,monospace);">{{ descriptor | json }}</pre>
    `,
    props: {
      fields: DEMO_FIELDS,
      descriptor: { junction: "and", rules: [] } as FilterDescriptor<DemoRow>,
    },
  }),
};

/** Pre-populated with a few rules. */
export const Prepopulated: Story = {
  render: () => ({
    template: `
      <ui-filter
        [fields]="fields"
        [allowJunction]="true"
        [(value)]="descriptor"
      />
      <pre style="margin-top:1rem;font-size:0.8125rem;background:var(--tv-surface-2,#fbfbfc);color:var(--tv-text,#1d232b);border:1px solid var(--tv-border,#d7dce2);padding:0.75rem;overflow-x:auto;font-family:var(--tv-font,monospace);">{{ descriptor | json }}</pre>
    `,
    props: {
      fields: DEMO_FIELDS,
      descriptor: {
        junction: "and",
        rules: [
          { id: 1, field: "name", operator: "contains", value: "John" },
          { id: 2, field: "age", operator: "greaterThan", value: "25" },
          {
            id: 3,
            field: "hireDate",
            operator: "inTheLast",
            value: "6",
            unit: "months",
          },
        ],
      } as FilterDescriptor<DemoRow>,
    },
  }),
};
