import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  ArrayTreeDatasource,
  DatasourceAdapter,
  FilterableArrayDatasource,
  UIAvatar,
  UIFilter,
  UITemplateColumn,
  UITextColumn,
  type FilterFieldDefinition,
  type FilterDescriptor,
  type TreeNode,
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
      <ui-text-column key="name" headerText="Name" [sortable]="true" />
      <ui-text-column key="role" headerText="Role" [sortable]="true" />

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

// ── Demo: With Filter (auto-inferred) ────────────────────────────────

@Component({
  selector: "ui-mdv-filter-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITemplateColumn, UIAvatar],
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
      [data]="employees"
      title="Employees"
      [showFilter]="true"
    >
      <ui-template-column key="name" headerText="Employee">
        <ng-template let-row>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <ui-avatar [email]="row.email" [name]="row.name" size="sm" />
            <div
              style="display: flex; flex-direction: column; gap: 0.1rem; min-width: 0;"
            >
              <span
                style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.name }}</span
              >
              <span
                style="font-size: 0.78rem; opacity: 0.65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.role }}</span
              >
            </div>
          </div>
        </ng-template>
      </ui-template-column>

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
  protected readonly employees = EMPLOYEES;
}

// ── Demo: Filter Always Expanded ─────────────────────────────────────

@Component({
  selector: "ui-mdv-filter-expanded-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITemplateColumn, UIAvatar],
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
      [data]="employees"
      title="Employees"
      [showFilter]="true"
      [filterExpanded]="true"
      [filterModeLocked]="true"
    >
      <ui-template-column key="name" headerText="Employee">
        <ng-template let-row>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <ui-avatar [email]="row.email" [name]="row.name" size="sm" />
            <div
              style="display: flex; flex-direction: column; gap: 0.1rem; min-width: 0;"
            >
              <span
                style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.name }}</span
              >
              <span
                style="font-size: 0.78rem; opacity: 0.65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.role }}</span
              >
            </div>
          </div>
        </ng-template>
      </ui-template-column>

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
class FilterExpandedDemo {
  protected readonly employees = EMPLOYEES;
}

// ── Demo: Filter Starts Collapsed ───────────────────────────────────

@Component({
  selector: "ui-mdv-filter-collapsed-demo",
  standalone: true,
  imports: [UIMasterDetailView, UITemplateColumn, UIAvatar],
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
      [data]="employees"
      title="Employees"
      [showFilter]="true"
      [filterExpanded]="false"
      [filterModeLocked]="true"
    >
      <ui-template-column key="name" headerText="Employee">
        <ng-template let-row>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <ui-avatar [email]="row.email" [name]="row.name" size="sm" />
            <div
              style="display: flex; flex-direction: column; gap: 0.1rem; min-width: 0;"
            >
              <span
                style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.name }}</span
              >
              <span
                style="font-size: 0.78rem; opacity: 0.65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
                >{{ row.role }}</span
              >
            </div>
          </div>
        </ng-template>
      </ui-template-column>

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
class FilterCollapsedDemo {
  protected readonly employees = EMPLOYEES;
}

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
          [data]="employees"
          [allowJunction]="true"
          [(value)]="filterDescriptor"
          (predicateChange)="onPredicate($event)"
        />
      </ng-template>

      <ui-text-column key="name" headerText="Name" [sortable]="true" />
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
class CustomFilterDemo {
  protected readonly fields = FILTER_FIELDS;
  protected readonly employees = EMPLOYEES;
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
    this.adapter.pageIndex.set(0);
    this.adapter.totalItems.set(this.datasource.getNumberOfItems() as number);
  }
}

// ── Demo: Tree Mode ──────────────────────────────────────────────────

interface OrgNode {
  name: string;
  title: string;
  email: string;
}

const ORG_TREE: TreeNode<OrgNode>[] = [
  {
    id: "ceo",
    data: { name: "Alice Chen", title: "CEO", email: "alice@example.com" },
    children: [
      {
        id: "cto",
        data: { name: "Bob Smith", title: "CTO", email: "bob@example.com" },
        children: [
          {
            id: "eng-lead",
            data: {
              name: "Carol Davis",
              title: "Engineering Lead",
              email: "carol@example.com",
            },
            children: [
              {
                id: "dev-1",
                data: {
                  name: "Dan Lee",
                  title: "Senior Developer",
                  email: "dan@example.com",
                },
              },
              {
                id: "dev-2",
                data: {
                  name: "Eve Wong",
                  title: "Developer",
                  email: "eve@example.com",
                },
              },
            ],
          },
          {
            id: "qa-lead",
            data: {
              name: "Frank Miller",
              title: "QA Lead",
              email: "frank@example.com",
            },
            children: [
              {
                id: "qa-1",
                data: {
                  name: "Grace Kim",
                  title: "QA Engineer",
                  email: "grace@example.com",
                },
              },
            ],
          },
        ],
      },
      {
        id: "cfo",
        data: { name: "Helen Park", title: "CFO", email: "helen@example.com" },
        children: [
          {
            id: "acct",
            data: {
              name: "Ivan Brown",
              title: "Senior Accountant",
              email: "ivan@example.com",
            },
          },
        ],
      },
      {
        id: "cmo",
        data: { name: "Julia Adams", title: "CMO", email: "julia@example.com" },
        children: [
          {
            id: "mktg",
            data: {
              name: "Kevin White",
              title: "Marketing Manager",
              email: "kevin@example.com",
            },
          },
        ],
      },
    ],
  },
];

@Component({
  selector: "ui-mdv-tree-demo",
  standalone: true,
  imports: [UIMasterDetailView],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 480px;
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 6px;
        overflow: hidden;
      }
    `,
  ],
  template: `
    <ui-master-detail-view
      [datasource]="treeDatasource"
      [treeDisplayWith]="displayWith"
      [showFilter]="true"
      title="Organization"
      placeholder="Select a person to view their profile"
    >
      <ng-template #nodeTemplate let-node>
        <div style="line-height: 1.3">
          <strong>{{ node.data.name }}</strong>
          <div style="font-size: 0.75rem; opacity: 0.65;">
            {{ node.data.title }}
          </div>
        </div>
      </ng-template>

      <ng-template #detail let-person>
        <h3 style="margin: 0 0 0.5rem">{{ person.name }}</h3>
        <dl
          style="margin: 0; display: grid; grid-template-columns: 7rem 1fr; gap: 0.35rem 1rem; font-size: 0.88rem;"
        >
          <dt style="font-weight: 600">Title</dt>
          <dd style="margin: 0">{{ person.title }}</dd>
          <dt style="font-weight: 600">Email</dt>
          <dd style="margin: 0">{{ person.email }}</dd>
        </dl>
      </ng-template>
    </ui-master-detail-view>
  `,
})
class TreeDemo {
  protected readonly treeDatasource = new ArrayTreeDatasource(ORG_TREE);
  protected readonly displayWith = (data: OrgNode): string => data.name;
}

// ── Storybook meta ───────────────────────────────────────────────────

const meta: Meta = {
  title: "@theredhead/UI Blocks/Master Detail View",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UIMasterDetailView` is a high-level layout component that pairs a **list panel** (table or tree) with a **detail panel**. Select an item in the list and the detail template renders its full information.",
          "",
          "## Key Features",
          "",
          "- **Table mode** (default) — content-project `<ui-text-column>`, `<ui-number-column>`, `<ui-template-column>`, etc. as list columns",
          "- **Tree mode** — pass an `ITreeDatasource` as `[datasource]` and optional `#nodeTemplate` for hierarchical navigation",
          "- **Detail template** — project a `#detail` ng-template; the selected item is available as `$implicit`",
          '- **Built-in filter** — set `[showFilter]="true"` for auto-inferred filtering, or project a custom `#filter` template',
          "- **Single selection** — row-click-to-select with automatic detail pane update",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `data` | `T[]` | — | Array of items for the built-in table datasource |",
          "| `datasource` | `DatasourceAdapter<T> \\| ITreeDatasource<T>` | — | External datasource (table or tree mode) |",
          "| `treeDisplayWith` | `(data: T) => string` | — | Display function for tree nodes |",
          "| `title` | `string` | — | Heading above the list panel |",
          "| `showFilter` | `boolean` | `false` | Show the collapsible filter bar |",
          "",
          "## Content Projection",
          "",
          "| Slot | Purpose |",
          "|------|---------|",
          "| Column components | Declarative table columns (same as `<ui-table-view>`) |",
          "| `#detail` | Template rendered for the selected item |",
          "| `#filter` | Optional custom filter template (overrides auto-inferred filter) |",
          "| `#nodeTemplate` | Optional custom tree-node template (tree mode only) |",
        ].join("\n"),
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        DefaultDemo,
        FilterDemo,
        FilterExpandedDemo,
        FilterCollapsedDemo,
        CustomFilterDemo,
        TreeDemo,
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj;

/**
 * **Default** — A table-based master-detail view with employee data.
 * Click any row to see the detail panel on the right. Columns are
 * content-projected just like in `<ui-table-view>`.
 */
export const Default: Story = {
  render: () => ({ template: `<ui-mdv-default-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view [data]="employees" title="Employees">
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
  <ui-text-column key="role" headerText="Role" [sortable]="true" />

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

/**
 * **With filter** — Enables the built-in auto-inferred filter bar by
 * setting `[showFilter]="true"`. No additional boilerplate is needed —
 * the component auto-generates filter fields from the column definitions.
 */
export const WithFilter: Story = {
  render: () => ({ template: `<ui-mdv-filter-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view [data]="employees" title="Employees" [showFilter]="true">
  <ui-template-column key="name" headerText="Employee">
    <ng-template let-row>
      <ui-avatar [email]="row.email" [name]="row.name" size="sm" />
      {{ row.name }}
    </ng-template>
  </ui-template-column>

  <ng-template #detail let-person>
    <h3>{{ person.name }}</h3>
  </ng-template>
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};

/**
 * **Filter mode-locked open** — The filter is always visible with no
 * toggle button. Useful when filtering is a core part of the
 * workflow and should not be hidden.
 */
export const FilterModeLockedOpen: Story = {
  render: () => ({ template: `<ui-mdv-filter-expanded-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view
  [data]="employees"
  title="Employees"
  [showFilter]="true"
  [filterExpanded]="true"
  [filterModeLocked]="true"
>
  <!-- columns and detail template -->
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};

/**
 * **Filter mode-locked closed** — The filter bar is completely hidden
 * with no toggle button visible. The user cannot open the filter.
 * Useful when filtering is available programmatically but the UI
 * should remain clean.
 */
export const FilterModeLockedClosed: Story = {
  render: () => ({ template: `<ui-mdv-filter-collapsed-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view
  [data]="employees"
  title="Employees"
  [showFilter]="true"
  [filterExpanded]="false"
  [filterModeLocked]="true"
>
  <!-- columns and detail template -->
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};

/**
 * **Custom filter template** — Projects a `#filter` ng-template to
 * completely replace the auto-inferred filter with a custom
 * `<ui-filter>` instance. Gives full control over filter field
 * definitions and junction toggles.
 */
export const CustomFilterTemplate: Story = {
  render: () => ({ template: `<ui-mdv-custom-filter-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view [datasource]="adapter" title="Employees" [showFilter]="true">
  <ng-template #filter>
    <ui-filter [fields]="fields" [data]="employees" [allowJunction]="true"
               [(value)]="descriptor"
               (predicateChange)="onPredicate($event)" />
  </ng-template>

  <ui-text-column key="name" headerText="Name" [sortable]="true" />

  <ng-template #detail let-person>
    <h3>{{ person.name }}</h3>
  </ng-template>
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};

/**
 * **Tree mode** — Switches from a table to a tree-view list panel by
 * passing a `datasource` with an `ITreeDatasource`. A custom `#nodeTemplate` shows each
 * person's name and title. Selecting a tree node updates the detail
 * panel on the right.
 */
export const TreeMode: Story = {
  render: () => ({ template: `<ui-mdv-tree-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view
  [datasource]="treeDatasource"
  [treeDisplayWith]="displayWith"
  title="Organization"
>
  <ng-template #nodeTemplate let-node>
    <strong>{{ node.data.name }}</strong>
    <div style="font-size: 0.75rem">{{ node.data.title }}</div>
  </ng-template>

  <ng-template #detail let-person>
    <h3>{{ person.name }}</h3>
    <p>{{ person.title }}</p>
    <p>{{ person.email }}</p>
  </ng-template>
</ui-master-detail-view>`,
        language: "html",
      },
    },
  },
};
