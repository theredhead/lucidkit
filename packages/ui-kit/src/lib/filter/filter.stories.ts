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
      style="margin-top:1rem;font-size:0.8125rem;background:var(--ui-surface-2,#fbfbfc);color:var(--ui-text,#1d232b);border:1px solid var(--ui-border,#d7dce2);padding:0.75rem;border-radius:0;overflow-x:auto;font-family:var(--ui-font,monospace);"
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

const meta: Meta = {
  title: "@theredhead/UI Kit/Filter",
  component: UIFilterStoryDemo,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the filter UI.",
    },
    allowJunction: {
      control: "boolean",
      description: "Enable AND/OR junction between filter rows.",
    },
    allowSimple: {
      control: "boolean",
      description: "Allow the simple (single-field) filter mode.",
    },
    allowAdvanced: {
      control: "boolean",
      description: "Allow the advanced (multi-field) filter mode.",
    },
    modeLocked: {
      control: "boolean",
      description: "Lock the current filter mode (prevent switching).",
    },
    showSaveButton: {
      control: "boolean",
      description: "Show a Save button to persist the filter.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "`UIFilter` is a dynamic filter-builder component that lets users construct query predicates by selecting a **field**, an **operator**, and a **value** — similar to the filter UI found in spreadsheets or database query builders.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [UIFilter],
    }),
  ],
};

export default meta;
type Story = StoryObj<UIFilterStoryDemo>;

/**
 * **Default** — A basic filter builder with five typed columns (Name, Email,
 * Age, Salary, Hire Date). Users can add rules, choose fields and operators,
 * and enter values. All rules are combined with AND logic. The live JSON
 * output below shows the `FilterDescriptor` that can be serialised or sent
 * to an API.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Field definitions** — pass an array of `FilterFieldDefinition` objects that describe available columns with their types (`string`, `number`, `date`)",
          "- **Smart operators** — operators are derived from the field type (e.g. `contains`, `startsWith` for strings; `greaterThan`, `lessThan` for numbers; `inTheLast` for dates)",
          "- **Junction toggle** — optionally allow users to switch between AND / OR conjunction via `[allowJunction]`",
          "- **Two-way binding** — the complete filter state is exposed as a `FilterDescriptor<T>` model for easy serialisation and restoration",
          "- **Pre-population** — set `value` to restore a previously saved filter",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `fields` | `FilterFieldDefinition<T>[]` | *(required)* | Defines the filterable columns with key, label, and type |",
          "| `allowJunction` | `boolean` | `false` | Shows an AND / OR toggle above the rule list |",
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `FilterDescriptor<T>` | Two-way bound descriptor containing junction mode and rule array |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `expressionChange` | `FilterExpression<T>` | Emits a compiled filter expression that can be passed to `FilterableArrayDatasource.filterBy()` |",
          "",
          "## FilterFieldDefinition",
          "",
          "```ts",
          "interface FilterFieldDefinition<T> {",
          "  key: keyof T;",
          "  label: string;",
          "  type: 'string' | 'number' | 'date';",
          "}",
          "```",
        ].join("\n"),
      },
      source: {
        code: `<ui-filter
  [fields]="fields"
  [(value)]="descriptor"
/>

// Component class:
readonly fields: FilterFieldDefinition<Row>[] = [
  { key: 'name',  label: 'Name',  type: 'string' },
  { key: 'age',   label: 'Age',   type: 'number' },
  { key: 'email', label: 'Email', type: 'string' },
];
readonly descriptor = signal<FilterDescriptor<Row>>({
  junction: 'and', rules: [],
});`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Junction toggle** — When `[allowJunction]="true"`, a toggle appears
 * letting the user switch between AND (all rules must match) and OR (any
 * rule can match). This is useful for more expressive filtering where users
 * need to combine criteria with different logical connectives.
 */
export const WithJunction: Story = {
  render: () => ({
    template: `
      <ui-filter
        [fields]="fields"
        [allowJunction]="true"
        [(value)]="descriptor"
      />
      <pre style="margin-top:1rem;font-size:0.8125rem;background:var(--ui-surface-2,#fbfbfc);color:var(--ui-text,#1d232b);border:1px solid var(--ui-border,#d7dce2);padding:0.75rem;overflow-x:auto;font-family:var(--ui-font,monospace);">{{ descriptor | json }}</pre>
    `,
    props: {
      fields: DEMO_FIELDS,
      descriptor: { junction: "and", rules: [] } as FilterDescriptor<DemoRow>,
    },
  }),
  parameters: {
    docs: {
      source: {
        code: [
          `// ── HTML ──`,
          `<ui-filter`,
          `  [fields]="fields"`,
          `  [allowJunction]="true"`,
          `  [(value)]="descriptor"`,
          `/>`,
          ``,
          `// ── TypeScript ──`,
          `import { signal } from '@angular/core';`,
          `import { UIFilter, FilterFieldDefinition, FilterDescriptor } from '@theredhead/ui-kit';`,
          ``,
          `readonly fields: FilterFieldDefinition<Row>[] = [`,
          `  { key: 'name',     label: 'Name',      type: 'string' },`,
          `  { key: 'email',    label: 'Email',      type: 'string' },`,
          `  { key: 'age',      label: 'Age',        type: 'number' },`,
          `  { key: 'salary',   label: 'Salary',     type: 'number' },`,
          `  { key: 'hireDate', label: 'Hire Date',  type: 'date'   },`,
          `];`,
          `readonly descriptor = signal<FilterDescriptor<Row>>({`,
          `  junction: 'and', rules: [],`,
          `});`,
          ``,
          `// ── SCSS ──`,
          `/* No custom styles required — UIFilter is fully self-contained. */`,
        ].join("\n"),
        language: "html",
      },
    },
  },
};

/**
 * **Pre-populated** — Demonstrates restoring a previously saved filter by
 * passing a `FilterDescriptor` with existing rules. This is useful for
 * persisting user filters to local storage or a database and restoring
 * them on page load. The three example rules show string `contains`,
 * number `greaterThan`, and date `inTheLast` operators.
 */
export const Prepopulated: Story = {
  render: () => ({
    template: `
      <ui-filter
        [fields]="fields"
        [allowJunction]="true"
        [(value)]="descriptor"
      />
      <pre style="margin-top:1rem;font-size:0.8125rem;background:var(--ui-surface-2,#fbfbfc);color:var(--ui-text,#1d232b);border:1px solid var(--ui-border,#d7dce2);padding:0.75rem;overflow-x:auto;font-family:var(--ui-font,monospace);">{{ descriptor | json }}</pre>
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
  parameters: {
    docs: {
      source: {
        code: [
          `// ── HTML ──`,
          `<ui-filter`,
          `  [fields]="fields"`,
          `  [allowJunction]="true"`,
          `  [(value)]="descriptor"`,
          `/>`,
          ``,
          `// ── TypeScript ──`,
          `import { signal } from '@angular/core';`,
          `import { UIFilter, FilterFieldDefinition, FilterDescriptor } from '@theredhead/ui-kit';`,
          ``,
          `readonly fields: FilterFieldDefinition<Row>[] = [`,
          `  { key: 'name',     label: 'Name',      type: 'string' },`,
          `  { key: 'email',    label: 'Email',      type: 'string' },`,
          `  { key: 'age',      label: 'Age',        type: 'number' },`,
          `  { key: 'salary',   label: 'Salary',     type: 'number' },`,
          `  { key: 'hireDate', label: 'Hire Date',  type: 'date'   },`,
          `];`,
          `readonly descriptor = signal<FilterDescriptor<Row>>({`,
          `  junction: 'and',`,
          `  rules: [`,
          `    { id: 1, field: 'name',     operator: 'contains',    value: 'John' },`,
          `    { id: 2, field: 'age',      operator: 'greaterThan', value: '25' },`,
          `    { id: 3, field: 'hireDate', operator: 'inTheLast',   value: '6', unit: 'months' },`,
          `  ],`,
          `});`,
          ``,
          `// ── SCSS ──`,
          `/* No custom styles required — UIFilter is fully self-contained. */`,
        ].join("\n"),
        language: "html",
      },
    },
  },
};
