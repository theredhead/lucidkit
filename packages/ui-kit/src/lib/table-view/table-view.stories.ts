/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from "@angular/core";

import type { FilterExpression } from "../core/types/filter";

import type { Meta, StoryObj } from "@storybook/angular";
import { moduleMetadata } from "@storybook/angular";

import { UIFilter } from "../filter/filter.component";
import type { FilterFieldDefinition } from "../filter/filter.types";
import { UIDensity, UIDensityDirective } from "../ui-density";
import { UIBadgeColumn } from "./columns/badge-column/badge-column.component";
import { UINumberColumn } from "./columns/number-column/number-column.component";
import { UITemplateColumn } from "./columns/template-column/template-column.component";
import { UITextColumn } from "./columns/text-column/text-column.component";
import { FilterableArrayDatasource } from "./datasources/filterable-array-datasource";
import {
  JsonPlaceholderCommentsDatasource,
  JsonPlaceholderPhotosDatasource,
  JsonPlaceholderPostsDatasource,
} from "./datasources/jsonplaceholder-datasource";
import { UITableView } from "./table-view.component";
import { SelectionModel } from "../core/selection-model";
import { UIButton } from "../button/button.component";

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
  ],
  template: `
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
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
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
  ],
  template: `
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
  readonly adapter = new JsonPlaceholderCommentsDatasource(25);
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
  ],
  template: `
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
  readonly adapter = new JsonPlaceholderPhotosDatasource(25);
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
  ],
  template: `
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
      style="margin-top: 1rem; padding: 0.75rem; font-size: 0.8rem; background: var(--ui-surface-2, #f6f7f8); border: 1px solid var(--ui-border, #d7dce2); border-radius: 4px;"
    >
Selected: {{ selectedJson() }}</pre
    >
  `,
})
class UITableViewSingleSelectDemo {
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
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
  ],
  template: `
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
      style="margin-top: 1rem; padding: 0.75rem; font-size: 0.8rem; background: var(--ui-surface-2, #f6f7f8); border: 1px solid var(--ui-border, #d7dce2); border-radius: 4px;"
    >
Selected ({{ selectedCount() }}): {{ selectedJson() }}</pre
    >
  `,
})
class UITableViewMultiSelectDemo {
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
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
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  argTypes: {
    caption: {
      control: "text",
      description: "Visible <caption> for the table.",
    },
    selectionMode: {
      control: "select",
      options: ["none", "single", "multiple"],
      description: "Row selection behaviour.",
    },
    showBuiltInPaginator: {
      control: "boolean",
      description: "Show the built-in pagination footer.",
    },
    showRowIndexIndicator: {
      control: "boolean",
      description: "Show a row-index column.",
    },
    showSelectionColumn: {
      control: "boolean",
      description: "Show the checkbox / radio selection column.",
    },
    rowClickSelect: {
      control: "boolean",
      description: "Select a row by clicking anywhere on it.",
    },
    pageSize: {
      control: "number",
      description: "Items per page.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the table.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "`UITableView` is a full-featured data table with pluggable datasources, declarative columns, sorting, pagination, row selection, and density control.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<object>;

/**
 * **JSONPlaceholder Posts** — The default demo fetching 25 posts from the
 * JSONPlaceholder API. Demonstrates number columns (ID, User ID), a
 * truncated text column (Title), and a badge column (Owner). Sorting,
 * pagination, and row-index indicators are all enabled.
 */
export const JsonPlaceholderPosts: Story = {
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  uiDensity="comfortable"
  caption="JSONPlaceholder Posts"
  tableId="posts-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-number-column key="userId" headerText="User ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="title" headerText="Title"
    [truncate]="true" [sortable]="true" />
  <ui-badge-column key="userId" headerText="Owner"
    variant="neutral" />
</ui-table-view>`,
        language: "html",
      },
    },
  },
};

/**
 * **JSONPlaceholder Comments** — A compact-density table showing comments
 * from the JSONPlaceholder API. Demonstrates a different dataset and
 * the `uiDensity="compact"` directive for denser row layouts.
 */
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
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  uiDensity="compact"
  caption="JSONPlaceholder Comments"
  tableId="comments-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-number-column key="postId" headerText="Post ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="email" headerText="Email"
    [truncate]="true" [sortable]="true" />
  <ui-text-column key="body" headerText="Comment"
    [truncate]="true" />
</ui-table-view>`,
        language: "html",
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  uiDensity="generous"
  caption="JSONPlaceholder Photos"
  tableId="photos-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-number-column key="albumId" headerText="Album ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="title" headerText="Title"
    [truncate]="true" [sortable]="true" />
  <ui-text-column key="thumbnailUrl" headerText="Thumbnail URL"
    [truncate]="true" />
</ui-table-view>`,
        language: "html",
      },
    },
  },
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
      description: "Initial page size for the datasource.",
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
      adapter: new JsonPlaceholderPostsDatasource(
        (args as { pageSize: number }).pageSize,
      ),
    },
    template: `
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
  parameters: {
    docs: {
      source: {
        code: `// ── HTML ──
<ui-table-view
  [uiDensity]="density"
  caption="Density Playground"
  tableId="density-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-number-column key="userId" headerText="User ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="title" headerText="Title"
    [truncate]="true" [sortable]="true" />
  <ui-badge-column key="userId" headerText="Owner"
    variant="neutral" />
</ui-table-view>

// ── TypeScript ──
import {
  UITableView,
  UINumberColumn,
  UITextColumn,
  UIBadgeColumn,
  type UIDensity,
} from '@theredhead/ui-kit';

density: UIDensity = 'comfortable'; // 'small' | 'compact' | 'comfortable' | 'generous'
adapter = new JsonPlaceholderPostsDatasource(25);

// ── SCSS ──
/* No custom styles needed — density is controlled via the uiDensity directive. */`,
        language: "html",
      },
    },
  },
};

/**
 * **Without built-in paginator** — Sets `[showBuiltInPaginator]="false"`
 * to hide the default pagination footer. Use this when you want to supply
 * your own external pagination UI or when the dataset is small enough
 * to display without pages.
 */
export const WithoutBuiltInPaginator: Story = {
  decorators: [
    moduleMetadata({
      imports: [
        UITableView,
        UINumberColumn,
        UITextColumn,
        UIBadgeColumn,
        UIDensityDirective,
      ],
    }),
  ],
  render: () => ({
    props: {
      adapter: new JsonPlaceholderPostsDatasource(25),
    },
    template: `
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
  parameters: {
    docs: {
      source: {
        code: `// ── HTML ──
<ui-table-view
  uiDensity="comfortable"
  caption="Posts"
  tableId="no-paginator-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="false"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-number-column key="userId" headerText="User ID"
    [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="title" headerText="Title"
    [truncate]="true" [sortable]="true" />
  <ui-badge-column key="userId" headerText="Owner"
    variant="neutral" />
</ui-table-view>

// ── TypeScript ──
import {
  UITableView,
  UINumberColumn,
  UITextColumn,
  UIBadgeColumn,
} from '@theredhead/ui-kit';

adapter = new JsonPlaceholderPostsDatasource(25);

// ── SCSS ──
/* No custom styles needed. Provide your own pagination UI externally. */`,
        language: "html",
      },
    },
  },
};

/**
 * **Single selection** — Enables single-row selection via
 * `selectionMode="single"` and `[rowClickSelect]="true"`. A
 * `SelectionModel` tracks the current selection externally.
 * Clicking a row highlights it and emits a `selectionChange` event.
 */
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
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  caption="Single Selection"
  tableId="single-select"
  selectionMode="single"
  [rowClickSelect]="true"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
  [selectionModel]="selectionModel"
  (selectionChange)="onSelectionChange($event)"
>
  <ui-number-column key="id" headerText="ID" [sortable]="true" />
  <ui-text-column key="title" headerText="Title" [truncate]="true" [sortable]="true" />
  <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
</ui-table-view>

// Component class:
readonly selectionModel = new SelectionModel<Post>('single', row => row.id);

onSelectionChange(rows: readonly Post[]): void {
  console.log('Selected:', rows);
}`,
        language: "typescript",
      },
    },
  },
};

/**
 * **Multiple selection** — Enables multi-row selection via
 * `selectionMode="multiple"`. Users can click rows to toggle selection;
 * a checkbox column appears automatically. The `SelectionModel` tracks
 * all selected rows.
 */
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
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  caption="Multiple Selection"
  tableId="multi-select"
  selectionMode="multiple"
  [rowClickSelect]="true"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
  [selectionModel]="selectionModel"
  (selectionChange)="onSelectionChange($event)"
>
  <ui-number-column key="id" headerText="ID" [sortable]="true" />
  <ui-text-column key="title" headerText="Title" [truncate]="true" [sortable]="true" />
  <ui-badge-column key="userId" headerText="Owner" variant="neutral" />
</ui-table-view>

// Component class:
readonly selectionModel = new SelectionModel<Post>('multiple', row => row.id);

onSelectionChange(rows: readonly Post[]): void {
  console.log('Selected:', rows.length, 'items');
}`,
        language: "typescript",
      },
    },
  },
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
    UIFilter,
  ],
  template: `
    <ui-filter
      [fields]="fields"
      [allowJunction]="true"
      (expressionChange)="onExpressionChange($event)"
    />
    <div style="margin-top:0.75rem;">
      <ui-table-view
        uiDensity="comfortable"
        caption="Employees"
        tableId="story-filtered"
        [showRowIndexIndicator]="true"
        [showBuiltInPaginator]="true"
        [datasource]="datasource"
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
  private readonly table = viewChild.required(UITableView);

  onExpressionChange(expression: FilterExpression<Employee>): void {
    this.datasource.filterBy(expression);
    this.table().refreshDatasource();
  }
}

/**
 * **Filtered table** — Combines `<ui-filter>` with `<ui-table-view>` using
 * a `FilterableArrayDatasource`. The filter emits a `FilterExpression<T>`
 * that is applied to the datasource in real time. This example uses a static
 * employee dataset with string, number, and date filter fields.
 */
export const FilteredTable: Story = {
  args: {
    selectionMode: "single"
  },

  decorators: [
    moduleMetadata({
      imports: [UITableViewFilteredDemo],
    }),
  ],

  render: () => ({
    template: "<ui-table-view-filtered-demo />",
    props: {},
  }),

  parameters: {
    docs: {
      source: {
        code: `<ui-filter
  [fields]="fields"
  [allowJunction]="true"
  (expressionChange)="onExpressionChange($event)"
/>

<ui-table-view
  caption="Employees"
  tableId="filtered-table"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="datasource"
>
  <ui-number-column key="id" headerText="ID" [sortable]="true" />
  <ui-text-column key="name" headerText="Name" [sortable]="true" />
  <ui-badge-column key="department" headerText="Dept" variant="neutral" />
  <ui-number-column key="age" headerText="Age" [sortable]="true" />
  <ui-number-column key="salary" headerText="Salary" [sortable]="true"
    [format]="{ style: 'currency', currency: 'USD' }" />
</ui-table-view>

// Component class:
readonly datasource = new FilterableArrayDatasource(employees);

@ViewChild(UITableView) table!: UITableView;

onExpressionChange(expression: FilterExpression<Employee>): void {
  this.datasource.filterBy(expression);
  this.table.refreshDatasource();
}`,
        language: "typescript",
      },
    },
  }
};

// ---------------------------------------------------------------------------
// Template column demo
// ---------------------------------------------------------------------------

@Component({
  selector: "ui-table-view-template-col-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UITableView,
    UINumberColumn,
    UITextColumn,
    UITemplateColumn,
    UIDensityDirective,
    UIButton,
  ],
  template: `
    <ui-table-view
      uiDensity="comfortable"
      caption="Template Column Demo"
      tableId="story-template-col"
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
      <ui-text-column
        key="title"
        headerText="Title"
        [truncate]="true"
        [sortable]="true"
      />
      <ui-template-column key="userId" headerText="Author">
        <ng-template let-row>
          <span style="display:inline-flex;align-items:center;gap:6px;">
            <span
              style="display:inline-block;width:24px;height:24px;border-radius:50%;background:var(--ui-accent,#3b82f6);color:#fff;font-size:0.75rem;line-height:24px;text-align:center;font-weight:600;"
              >{{ row.userId }}</span
            >
            <span>User {{ row.userId }}</span>
          </span>
        </ng-template>
      </ui-template-column>
      <ui-template-column key="actions" headerText="Actions">
        <ng-template let-row>
          <ui-button
            variant="outlined"
            size="small"
            (click)="onAction('view', row)"
          >
            View
          </ui-button>
          <ui-button
            size="small"
            style="margin-left: 4px"
            (click)="onAction('edit', row)"
          >
            Edit
          </ui-button>
        </ng-template>
      </ui-template-column>
    </ui-table-view>
    <pre class="tpl-output">{{ lastAction() }}</pre>
  `,
  styles: [
    `
      .tpl-output {
        margin-top: 1rem;
        padding: 0.75rem;
        font-size: 0.8rem;
        background: var(--ui-surface-2, #f6f7f8);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
      }
    `,
  ],
})
class UITableViewTemplateColDemo {
  readonly adapter = new JsonPlaceholderPostsDatasource(25);
  readonly lastAction = signal("Click a button to see the action here…");

  onAction(action: string, row: any): void {
    this.lastAction.set(
      `${action.toUpperCase()}: ${JSON.stringify({ id: row.id, title: row.title }, null, 2)}`,
    );
  }
}

/**
 * **Template column** — Uses `<ui-template-column>` to render fully custom
 * cell content via `<ng-template let-row>`. This example shows an avatar
 * circle for the author and action buttons (View / Edit) that log the
 * clicked row.
 */
export const TemplateColumn: Story = {
  decorators: [
    moduleMetadata({
      imports: [UITableViewTemplateColDemo],
    }),
  ],
  render: () => ({
    template: "<ui-table-view-template-col-demo />",
    props: {},
  }),
  parameters: {
    docs: {
      source: {
        code: `<ui-table-view
  caption="Template Column Demo"
  tableId="template-col"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [datasource]="adapter"
>
  <ui-number-column key="id" headerText="ID" [sortable]="true" />
  <ui-text-column key="title" headerText="Title" [truncate]="true" [sortable]="true" />

  <ui-template-column key="userId" headerText="Author">
    <ng-template let-row>
      <span>User {{ row.userId }}</span>
    </ng-template>
  </ui-template-column>

  <ui-template-column key="actions" headerText="Actions">
    <ng-template let-row>
      <button (click)="onAction('view', row)">View</button>
      <button (click)="onAction('edit', row)">Edit</button>
    </ng-template>
  </ui-template-column>
</ui-table-view>`,
        language: "html",
      },
    },
  },
};

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
  { id: 1, name: "John Doe", email: "john@example.com", age: 30, status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, status: "inactive" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35, status: "active" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", age: 28, status: "pending" },
  { id: 5, name: "Charlie Brown", email: "charlie@example.com", age: 32, status: "active" },
  { id: 6, name: "Diana Miller", email: "diana@example.com", age: 27, status: "inactive" },
  { id: 7, name: "Ethan Davis", email: "ethan@example.com", age: 31, status: "pending" },
  { id: 8, name: "Fiona Garcia", email: "fiona@example.com", age: 29, status: "active" },
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
  template: `
    <div class="local-demo-controls">
      <ui-filter
        [fields]="filterFields"
        [allowJunction]="true"
        (expressionChange)="onExpressionChange($event)"
      />
      <ui-button variant="outlined" (click)="toggleDensity()">
        Density: {{ density() }}
      </ui-button>
    </div>
    <ui-table-view
      [uiDensity]="density()"
      caption="Team Members"
      tableId="story-local-data"
      selectionMode="multiple"
      [rowClickSelect]="true"
      [showRowIndexIndicator]="true"
      [showBuiltInPaginator]="true"
      [selectionModel]="selectionModel"
      [datasource]="datasource"
      (selectionChange)="onSelectionChange($event)"
    >
      <ui-number-column
        key="id"
        headerText="ID"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-text-column key="name" headerText="Name" [sortable]="true" [truncate]="true" />
      <ui-text-column key="email" headerText="Email" [sortable]="true" [truncate]="true" />
      <ui-number-column
        key="age"
        headerText="Age"
        [sortable]="true"
        [format]="{ maximumFractionDigits: 0 }"
      />
      <ui-badge-column key="status" headerText="Status" [sortable]="true" />
      <ui-template-column key="actions" headerText="Actions" [sortable]="false">
        <ng-template #cell let-row>
          <ui-button variant="outlined" size="small" (click)="onAction(row)">
            View
          </ui-button>
        </ng-template>
      </ui-template-column>
    </ui-table-view>
    <pre class="local-demo-output">{{ statusLine() }}</pre>
  `,
  styles: [
    `
      .local-demo-controls {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding: 1rem;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f6f7f8);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
      }

      .local-demo-output {
        margin-top: 1rem;
        padding: 0.75rem;
        font-size: 0.8rem;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f6f7f8);
        border: 1px solid var(--ui-border, #d7dce2);
        border-radius: 4px;
      }
    `,
  ],
})
class UITableViewLocalDataDemo {
  readonly filterFields = DEMO_FILTER_FIELDS;
  readonly datasource = new FilterableArrayDatasource(DEMO_ROWS);
  readonly selectionModel = new SelectionModel<DemoRow>(
    "multiple",
    (row) => row.id,
  );
  readonly density = signal<UIDensity>("comfortable");
  readonly statusLine = signal(
    "Select rows or click View to see output here…",
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

/**
 * **Local data with filter, selection & actions** — A self-contained demo
 * using an in-memory `FilterableArrayDatasource`. Combines `<ui-filter>`,
 * multi-row selection with a `SelectionModel`, a `<ui-template-column>`
 * action button, and an interactive density toggle.
 */
export const LocalDataDemo: Story = {
  args: {
    selectionMode: "none"
  },

  decorators: [
    moduleMetadata({
      imports: [UITableViewLocalDataDemo],
    }),
  ],

  render: () => ({
    template: "<ui-table-view-local-data-demo />",
    props: {},
  }),

  parameters: {
    docs: {
      source: {
        language: "html",
        code: `// ── HTML ──
<ui-filter
  [fields]="filterFields"
  [allowJunction]="true"
  (expressionChange)="onExpressionChange($event)"
/>

<ui-table-view
  [uiDensity]="density"
  caption="Team Members"
  tableId="local-data"
  selectionMode="multiple"
  [rowClickSelect]="true"
  [showRowIndexIndicator]="true"
  [showBuiltInPaginator]="true"
  [selectionModel]="selectionModel"
  [datasource]="datasource"
  (selectionChange)="onSelectionChange($event)"
>
  <ui-number-column key="id" headerText="ID" [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-text-column key="name" headerText="Name" [sortable]="true" [truncate]="true" />
  <ui-text-column key="email" headerText="Email" [sortable]="true" [truncate]="true" />
  <ui-number-column key="age" headerText="Age" [sortable]="true" [format]="{ maximumFractionDigits: 0 }" />
  <ui-badge-column key="status" headerText="Status" [sortable]="true" />
  <ui-template-column key="actions" headerText="Actions" [sortable]="false">
    <ng-template #cell let-row>
      <ui-button variant="outlined" size="small" (click)="onAction(row)">View</ui-button>
    </ng-template>
  </ui-template-column>
</ui-table-view>

// ── TypeScript ──
import { Component, signal, viewChild } from '@angular/core';
import {
  UITableView, UITextColumn, UINumberColumn, UIBadgeColumn, UITemplateColumn,
  UIButton, UIFilter, UIDensityDirective,
  FilterableArrayDatasource, SelectionModel,
} from '@theredhead/ui-kit';
import type { FilterExpression, FilterFieldDefinition } from '@theredhead/ui-kit';

interface Row { id: number; name: string; email: string; age: number; status: string; }

readonly datasource = new FilterableArrayDatasource<Row>(rows);
readonly selectionModel = new SelectionModel<Row>('multiple', row => row.id);
private readonly table = viewChild.required(UITableView);

onExpressionChange(expression: FilterExpression<Row>): void {
  this.datasource.filterBy(expression);
  this.table().refreshDatasource();
}

onSelectionChange(rows: readonly Row[]): void { /* update UI */ }
onAction(row: Row): void { /* handle action */ }

// ── SCSS ──
/* No custom styles needed. */`,
      },
    },
  }
};

/**
 * _API Reference_ — features, inputs, column types, and configuration.
 */
export const Documentation: Story = {
  tags: ["!dev"],
  render: () => ({ template: " " }),
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — any object implementing `IDatasource<T>` can feed the table; ships with `ArrayDatasource`, `FilterableArrayDatasource`, and JSONPlaceholder demo sources",
          "- **Declarative columns** — add `<ui-text-column>`, `<ui-number-column>`, `<ui-badge-column>`, or `<ui-template-column>` as content children",
          '- **Sorting** — enable per-column with `[sortable]="true"`; click headers to cycle asc / desc / none',
          '- **Pagination** — built-in paginator with configurable page sizes, or bring your own with `[showBuiltInPaginator]="false"`',
          '- **Row selection** — `selectionMode` supports `"none"`, `"single"`, and `"multiple"` with a `SelectionModel` for external tracking',
          "- **UI Density** — apply the `uiDensity` directive (`compact`, `comfortable`, `spacious`) to control row height",
          "- **Resizable columns** — drag column borders to resize",
          "- **Filter integration** — pair with `<ui-filter>` and `FilterableArrayDatasource` for dynamic client-side filtering",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `TableViewDatasource<T>` | *(required)* | Provides rows and page metadata |",
          '| `caption` | `string` | `""` | Accessible table caption |',
          "| `tableId` | `string` | auto | Unique ID for the `<table>` element |",
          "| `showBuiltInPaginator` | `boolean` | `true` | Show / hide the built-in paginator footer |",
          "| `showRowIndexIndicator` | `boolean` | `false` | Show a row-number column |",
          "| `resizable` | `boolean` | `false` | Enable column resize handles |",
          '| `selectionMode` | `"none" \\| "single" \\| "multiple"` | `"none"` | Row selection behaviour |',
          "| `selectionModel` | `SelectionModel<T>` | — | External selection tracker |",
          "| `rowClickSelect` | `boolean` | `false` | Select rows by clicking anywhere on the row |",
          "",
          "## Column Types",
          "",
          "| Column | Purpose |",
          "|--------|---------|",
          "| `<ui-text-column>` | Plain text, optional truncation |",
          "| `<ui-number-column>` | Formatted numbers via `Intl.NumberFormat` |",
          "| `<ui-badge-column>` | Coloured badge pill |",
          "| `<ui-template-column>` | Fully custom `<ng-template let-row>` |",
        ].join("\n"),
      },
      source: { code: " " },
    },
  },
};
