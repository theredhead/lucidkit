import {
  ChangeDetectionStrategy,
  Component,
  type Predicate,
  signal,
} from "@angular/core";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIFilter } from "../filter/filter.component";
import type { FilterFieldDefinition } from "../filter/filter.types";
import { UiThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { UIDensity, UIDensityDirective } from "../ui-density";
import { UIBadgeColumn } from "./columns/badge-column/badge-column.component";
import { UINumberColumn } from "./columns/number-column/number-column.component";
import { UITextColumn } from "./columns/text-column/text-column.component";
import { DatasourceAdapter } from "./datasources/datasource-adapter";
import { FilterableArrayDatasource } from "./datasources/filterable-array-datasource";
import {
  JsonPlaceholderCommentsDatasource,
  JsonPlaceholderPhotosDatasource,
  JsonPlaceholderPostsDatasource,
} from "./datasources/jsonplaceholder-datasource";
import { UITableView } from "./table-view.component";
import { SelectionModel } from "../core/selection-model";

@Component({
  selector: "ui-table-view-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="comfortable"
      caption="JSONPlaceholder Posts"
      tableId="story-posts"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="userId"
        headerText="User ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
    </ui-table-view>
  `,
})
class UITableViewStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPostsDatasource(25),
  );
}

@Component({
  selector: "ui-table-view-comments-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="compact"
      caption="JSONPlaceholder Comments"
      tableId="story-comments"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="postId"
        headerText="Post ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="email"
        headerText="Email"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-text-column key="body" headerText="Comment" [truncate]="true" />
    </ui-table-view>
  `,
})
class UITableViewCommentsStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderCommentsDatasource(25),
  );
}

@Component({
  selector: "ui-table-view-photos-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="generous"
      caption="JSONPlaceholder Photos"
      tableId="story-photos"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="albumId"
        headerText="Album ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-text-column
        key="thumbnailUrl"
        headerText="Thumbnail URL"
        [truncate]="true"
      />
    </ui-table-view>
  `,
})
class UITableViewPhotosStoryDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPhotosDatasource(25),
  );
}

@Component({
  selector: "ui-table-view-single-select-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="comfortable"
      caption="Single Selection"
      tableId="story-single-select"
      selectionMode="single"
      [rowClickSelect]="true"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
      [selectionModel]="selectionModel"
      (selectionChange)="onSelectionChange($event)"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="userId"
        headerText="User ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
    </ui-table-view>
    <pre
      style="margin-top: 1rem; padding: 0.75rem; font-size: 0.8rem; background: var(--tv-surface-2, #f6f7f8); border: 1px solid var(--tv-border, #d7dce2); border-radius: 4px;"
    >
Selected: {{ selectedJson() }}</pre
    >
  `,
})
class UITableViewSingleSelectDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPostsDatasource(25),
  );
  readonly selectionModel = new SelectionModel<any>("single", (row) => row.id);
  readonly selectedJson = signal("(none)");

  onSelectionChange(rows: readonly unknown[]): void {
    this.selectedJson.set(
      rows.length > 0 ? JSON.stringify(rows[0], null, 2) : "(none)",
    );
  }
}

@Component({
  selector: "ui-table-view-multi-select-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-table-view
      uiDensity="comfortable"
      caption="Multiple Selection"
      tableId="story-multi-select"
      selectionMode="multiple"
      [rowClickSelect]="true"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [datasource]="adapter"
      [selectionModel]="selectionModel"
      (selectionChange)="onSelectionChange($event)"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-number-column
        key="userId"
        headerText="User ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
    </ui-table-view>
    <pre
      style="margin-top: 1rem; padding: 0.75rem; font-size: 0.8rem; background: var(--tv-surface-2, #f6f7f8); border: 1px solid var(--tv-border, #d7dce2); border-radius: 4px;"
    >
Selected ({{ selectedCount() }}): {{ selectedJson() }}</pre
    >
  `,
})
class UITableViewMultiSelectDemo {
  readonly adapter = new DatasourceAdapter(
    new JsonPlaceholderPostsDatasource(25),
  );
  readonly selectionModel = new SelectionModel<any>(
    "multiple",
    (row) => row.id,
  );
  readonly selectedJson = signal("(none)");
  readonly selectedCount = signal(0);

  onSelectionChange(rows: readonly unknown[]): void {
    this.selectedCount.set(rows.length);
    this.selectedJson.set(
      rows.length > 0
        ? JSON.stringify(
            rows.map((r: any) => ({ id: r.id, title: r.title })),
            null,
            2,
          )
        : "(none)",
    );
  }
}

const meta: Meta<object> = {
  title: "@Theredhead/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Table View demo backed by JSONPlaceholder posts using the Storybook-only JSONPlaceholder datasource adapters.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<object>;

export const JsonPlaceholderPosts: Story = {};

export const JsonPlaceholderComments: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewCommentsStoryDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-comments-story-demo />",
    props: {},
  }),
};

export const JsonPlaceholderPhotos: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewPhotosStoryDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-photos-story-demo />",
    props: {},
  }),
};

export const DensityPlayground: Story = {
  decorators: [
    moduleMetadata({
      imports: [
        UITableView,
        UINumberColumn,
        UITextColumn,
        UIBadgeColumn,
        UIDensityDirective,
        UiThemeToggleComponent,
      ],
    }),
  ],
  argTypes: {
    density: {
      control: "inline-radio",
      options: [
        "small",
        "compact",
        "comfortable",
        "generous",
      ] satisfies UIDensity[],
      description:
        "Applies global density tokens through the uiDensity directive.",
    },
    showBuiltInPaginator: {
      control: "boolean",
      description: "Show/hide the built-in table paginator footer.",
    },
    showRowIndexIndicator: {
      control: "boolean",
      description: "Show/hide a leading row-index indicator column.",
    },
    pageSize: {
      control: { type: "number", min: 5, max: 100, step: 5 },
      description: "Initial page size passed to DatasourceAdapter.",
    },
  },
  args: {
    density: "comfortable",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    pageSize: 25,
  },
  render: (args) => ({
    props: {
      density: (args as { density: UIDensity }).density,
      showBuiltInPaginator: (args as { showBuiltInPaginator: boolean })
        .showBuiltInPaginator,
      showRowIndexIndicator: (args as { showRowIndexIndicator: boolean })
        .showRowIndexIndicator,
      adapter: new DatasourceAdapter(
        new JsonPlaceholderPostsDatasource(
          (args as { pageSize: number }).pageSize,
        ),
        (args as { pageSize: number }).pageSize,
      ),
    },
    template: `
            <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
                <ui-theme-toggle variant="button" [showTooltip]="true" ariaLabel="Toggle table theme" />
            </div>
            <ui-table-view
                [uiDensity]="density"
                caption="Density Playground"
                tableId="story-density"
                [showRowIndexIndicator]="showRowIndexIndicator"
                [showBuiltInPaginator]="showBuiltInPaginator"
                [datasource]="adapter"
            >
                <ui-number-column
                    key="id"
                    headerText="ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-number-column
                    key="userId"
                    headerText="User ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-text-column
                    key="title"
                    headerText="Title"
                    [truncate]="true"
                    [sortable]="true"
                />
                <ui-badge-column
                    key="userId"
                    headerText="Owner"
                    variant="neutral"
                />
            </ui-table-view>
        `,
  }),
};

export const WithoutBuiltInPaginator: Story = {
  decorators: [
    moduleMetadata({
      imports: [
        UITableView,
        UINumberColumn,
        UITextColumn,
        UIBadgeColumn,
        UIDensityDirective,
        UiThemeToggleComponent,
      ],
    }),
  ],
  render: () => ({
    props: {
      adapter: new DatasourceAdapter(
        new JsonPlaceholderPostsDatasource(25),
        25,
      ),
    },
    template: `
            <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
                <ui-theme-toggle variant="button" [showTooltip]="true" ariaLabel="Toggle table theme" />
            </div>
            <ui-table-view
                uiDensity="comfortable"
                caption="Without Built-in Paginator"
                tableId="story-no-paginator"
                [showRowIndexIndicator]="true"
                [showBuiltInPaginator]="false"
                [datasource]="adapter"
            >
                <ui-number-column
                    key="id"
                    headerText="ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-number-column
                    key="userId"
                    headerText="User ID"
                    [sortable]="true"
                    [format]="{ maximumFractionDigits: 0 }"
                />
                <ui-text-column
                    key="title"
                    headerText="Title"
                    [truncate]="true"
                    [sortable]="true"
                />
                <ui-badge-column
                    key="userId"
                    headerText="Owner"
                    variant="neutral"
                />
            </ui-table-view>
        `,
  }),
};

export const SingleSelection: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewSingleSelectDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-single-select-demo />",
    props: {},
  }),
};

export const MultipleSelection: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewMultiSelectDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-multi-select-demo />",
    props: {},
  }),
};

// ---------------------------------------------------------------------------
// Filtered table demo
// ---------------------------------------------------------------------------

interface Employee {
  id: number;
  name: string;
  department: string;
  age: number;
  salary: number;
  hireDate: string;
}

const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Alice Johnson",
    department: "Engineering",
    age: 32,
    salary: 95_000,
    hireDate: "2019-03-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    department: "Marketing",
    age: 28,
    salary: 72_000,
    hireDate: "2021-07-01",
  },
  {
    id: 3,
    name: "Carol Williams",
    department: "Engineering",
    age: 45,
    salary: 120_000,
    hireDate: "2015-01-10",
  },
  {
    id: 4,
    name: "David Brown",
    department: "Sales",
    age: 38,
    salary: 88_000,
    hireDate: "2018-11-20",
  },
  {
    id: 5,
    name: "Eve Davis",
    department: "Engineering",
    age: 26,
    salary: 78_000,
    hireDate: "2023-02-28",
  },
  {
    id: 6,
    name: "Frank Miller",
    department: "HR",
    age: 41,
    salary: 82_000,
    hireDate: "2017-06-14",
  },
  {
    id: 7,
    name: "Grace Wilson",
    department: "Marketing",
    age: 34,
    salary: 76_000,
    hireDate: "2020-09-03",
  },
  {
    id: 8,
    name: "Henry Moore",
    department: "Sales",
    age: 29,
    salary: 71_000,
    hireDate: "2022-04-18",
  },
  {
    id: 9,
    name: "Ivy Taylor",
    department: "Engineering",
    age: 37,
    salary: 105_000,
    hireDate: "2016-08-22",
  },
  {
    id: 10,
    name: "Jack Anderson",
    department: "HR",
    age: 52,
    salary: 98_000,
    hireDate: "2012-12-05",
  },
  {
    id: 11,
    name: "Karen Thomas",
    department: "Engineering",
    age: 30,
    salary: 91_000,
    hireDate: "2021-01-11",
  },
  {
    id: 12,
    name: "Leo Martinez",
    department: "Sales",
    age: 35,
    salary: 84_000,
    hireDate: "2019-10-30",
  },
  {
    id: 13,
    name: "Mia Garcia",
    department: "Marketing",
    age: 27,
    salary: 68_000,
    hireDate: "2023-06-07",
  },
  {
    id: 14,
    name: "Noah Robinson",
    department: "Engineering",
    age: 43,
    salary: 115_000,
    hireDate: "2014-05-19",
  },
  {
    id: 15,
    name: "Olivia Clark",
    department: "HR",
    age: 39,
    salary: 86_000,
    hireDate: "2018-03-25",
  },
];

const EMPLOYEE_FIELDS: FilterFieldDefinition<Employee>[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "department", label: "Department", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "salary", label: "Salary", type: "number" },
  { key: "hireDate", label: "Hire Date", type: "date" },
];

@Component({
  selector: "ui-table-view-filtered-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UIBadgeColumn,
    UIDensityDirective,
    UiThemeToggleComponent,
    UIFilter,
  ],
  template: `
    <div style="display:flex;justify-content:flex-end;margin:0 0 0.75rem;">
      <ui-theme-toggle
        variant="button"
        [showTooltip]="true"
        ariaLabel="Toggle table theme"
      />
    </div>
    <ui-filter
      [fields]="fields"
      [allowJunction]="true"
      (predicateChange)="onPredicateChange($event)"
    />
    <div style="margin-top:0.75rem;">
      <ui-table-view
        uiDensity="comfortable"
        caption="Employees"
        tableId="story-filtered"
        [showRowIndexIndicator]="true"
        [showBuiltInPaginator]="true"
        [datasource]="adapter"
      >
        <ui-number-column
          key="id"
          headerText="ID"
          [sortable]="true"
          [format]="{ maximumFractionDigits: 0 }"
        />
        <ui-text-column key="name" headerText="Name" [sortable]="true" />
        <ui-badge-column key="department" headerText="Dept" variant="neutral" />
        <ui-number-column
          key="age"
          headerText="Age"
          [sortable]="true"
          [format]="{ maximumFractionDigits: 0 }"
        />
        <ui-number-column
          key="salary"
          headerText="Salary"
          [sortable]="true"
          [format]="{
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }"
        />
        <ui-text-column
          key="hireDate"
          headerText="Hire Date"
          [sortable]="true"
        />
      </ui-table-view>
    </div>
  `,
})
class UITableViewFilteredDemo {
  readonly fields = EMPLOYEE_FIELDS;
  readonly datasource = new FilterableArrayDatasource(EMPLOYEES);
  adapter = new DatasourceAdapter(this.datasource);

  onPredicateChange(predicate: Predicate<Employee> | undefined): void {
    this.datasource.applyPredicate(predicate ?? null);
    // Rebuild the adapter so the table picks up the new row count.
    this.adapter = new DatasourceAdapter(this.datasource);
  }
}

export const FilteredTable: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewFilteredDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-filtered-demo />",
    props: {},
  }),
};
