import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ArrayDatasource,
  DatasourceAdapter,
  FilterableArrayDatasource,
  UIFilter,
  UITextColumn,
  type FilterFieldDefinition,
  type FilterDescriptor,
} from "@theredhead/ui-kit";

import { UIMasterDetailView } from "./master-detail-view.component";

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
];

// ── Demo: Default ────────────────────────────────────────────────────

@Component({
  selector: "ui-mdv-default-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 420px;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }
    `,
  ],
  template: `
    <ui-master-detail-view
      [data]="employees"
      title="Employees"
      placeholder="Select an employee to view their profile"
      (selectedChange)="selected.set($event)"
    >
      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="department" headerText="Department" />
      <ui-text-column key="role" headerText="Role" />

      <ng-template #detail let-person>
        <div class="detail">
          <h3 style="margin: 0 0 0.5rem">{{ person.name }}</h3>
          <dl
            style="margin: 0; display: grid; grid-template-columns: 7rem 1fr; gap: 0.35rem 1rem; font-size: 0.88rem;"
          >
            <dt style="font-weight: 600">Email</dt>
            <dd style="margin: 0">{{ person.email }}</dd>
            <dt style="font-weight: 600">Department</dt>
            <dd style="margin: 0">{{ person.department }}</dd>
            <dt style="font-weight: 600">Role</dt>
            <dd style="margin: 0">{{ person.role }}</dd>
            <dt style="font-weight: 600">Joined</dt>
            <dd style="margin: 0">{{ person.joined }}</dd>
          </dl>
        </div>
      </ng-template>
    </ui-master-detail-view>
  `,
})
class DefaultDemo {
  protected readonly employees = EMPLOYEES;
  protected readonly selected = signal<Employee | undefined>(undefined);
}

// ── Demo: With Filter ────────────────────────────────────────────────

const FILTER_FIELDS: FilterFieldDefinition<Employee>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "department", label: "Department", type: "string" },
  { key: "role", label: "Role", type: "string" },
];

@Component({
  selector: "ui-mdv-filter-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITextColumn, UIFilter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 520px;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }
    `,
  ],
  template: `
    <ui-master-detail-view
      [datasource]="adapter"
      title="Employees"
      [showFilter]="true"
    >
      <ng-template #filter>
        <ui-filter
          [fields]="fields"
          [(value)]="filterDescriptor"
          (predicateChange)="onPredicate($event)"
        />
      </ng-template>

      <ui-text-column key="name" headerText="Name" />
      <ui-text-column key="department" headerText="Department" />
      <ui-text-column key="role" headerText="Role" />

      <ng-template #detail let-person>
        <h3 style="margin: 0 0 0.5rem">{{ person.name }}</h3>
        <p style="margin: 0; font-size: 0.88rem; opacity: 0.7">
          {{ person.department }} · {{ person.role }}
        </p>
        <p style="margin: 0.75rem 0 0; font-size: 0.88rem">
          {{ person.email }}
        </p>
      </ng-template>
    </ui-master-detail-view>
  `,
})
class FilterDemo {
  protected readonly fields = FILTER_FIELDS;
  protected readonly filterDescriptor = signal<FilterDescriptor<Employee>>({
    junction: "and",
    rules: [],
  });

  private readonly datasource = new FilterableArrayDatasource(EMPLOYEES);
  protected readonly adapter = new DatasourceAdapter(this.datasource, 100);

  protected onPredicate(
    predicate: ((item: Employee) => boolean) | undefined,
  ): void {
    this.datasource.applyPredicate(predicate ?? null);
    // Reset to page 0 and refresh
    this.adapter.pageIndex.set(0);
    this.adapter.totalItems.set(this.datasource.getNumberOfItems() as number);
  }
}

// ── Storybook meta ───────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Blocks/Master Detail View",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A master-detail layout combining a `<ui-table-view>` list panel " +
          "with a detail template pane. Content-project table columns and " +
          "a `#detail` ng-template (selected item available as `$implicit`). " +
          "Optionally add a collapsible `#filter` template above the list.\n\n" +
          "The table uses single selection, row-click select, page size 100, " +
          "no pagination, and no built-in leading columns.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DefaultDemo, FilterDemo],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/** Default master-detail view — click a row to see the detail panel. */
export const Default: Story = {
  render: () => ({ template: `<ui-mdv-default-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view [data]="employees" title="Employees">
  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="department" headerText="Department" />
  <ui-text-column key="role" headerText="Role" />

  <ng-template #detail let-person>
    <h3>{{ person.name }}</h3>
    <p>{{ person.email }}</p>
  </ng-template>
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};

/** With a collapsible filter panel above the list. */
export const WithFilter: Story = {
  render: () => ({ template: `<ui-mdv-filter-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view [datasource]="adapter" title="Employees" [showFilter]="true">
  <ng-template #filter>
    <ui-filter [fields]="fields" [(value)]="descriptor"
               (predicateChange)="onPredicate($event)" />
  </ng-template>

  <ui-text-column key="name" headerText="Name" />
  <ui-text-column key="department" headerText="Department" />

  <ng-template #detail let-person>
    <h3>{{ person.name }}</h3>
  </ng-template>
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};
