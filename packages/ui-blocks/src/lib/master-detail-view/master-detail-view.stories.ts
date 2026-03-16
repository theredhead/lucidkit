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
      [treeDatasource]="treeDatasource"
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
        component:
          "A master-detail layout combining a `<ui-table-view>` or `<ui-tree-view>` " +
          "list panel with a detail template pane. Content-project table columns and " +
          "a `#detail` ng-template (selected item available as `$implicit`). " +
          "Pass a `treeDatasource` to switch to hierarchical tree mode. " +
          "Optionally add a collapsible `#filter` template above the list.\n\n" +
          "Both table and tree modes use single selection. " +
          "Table mode: row-click select, page size 100, no pagination.",
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [DefaultDemo, FilterDemo, CustomFilterDemo, TreeDemo],
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

/** With auto-inferred filter — just `[showFilter]="true"`, no boilerplate. */
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

/** With a fully custom filter template (override). */
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

/** Tree mode — hierarchical master list with a custom node template. */
export const TreeMode: Story = {
  render: () => ({ template: `<ui-mdv-tree-demo />` }),
  parameters: {
    docs: {
      source: {
        code: `<ui-master-detail-view
  [treeDatasource]="treeDatasource"
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
