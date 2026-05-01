import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableViewStoryDemo } from "./json-placeholder-posts.story";
import {
  TABLE_VIEW_STORY_ARG_TYPES,
  type TableViewStoryArgs,
} from "../table-view-story-helpers";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UITableView` is a full-featured data table with pluggable datasources, declarative columns, sorting, pagination, row selection, and density control.",
          "",
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
    },
  },
  argTypes: TABLE_VIEW_STORY_ARG_TYPES,
  decorators: [moduleMetadata({ imports: [UITableViewStoryDemo] })],
} satisfies Meta<TableViewStoryArgs>;

export default meta;
type Story = StoryObj<TableViewStoryArgs>;

export const JsonPlaceholderPosts: Story = {
  args: {
    caption: "JSONPlaceholder Posts",
    selectionMode: "none",
    showBuiltInPaginator: true,
    showRowIndexIndicator: true,
    showSelectionColumn: true,
    rowClickSelect: false,
    pageSize: undefined,
    disabled: false,
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-table-view-story-demo
        [caption]="caption"
        [selectionMode]="selectionMode"
        [showBuiltInPaginator]="showBuiltInPaginator"
        [showRowIndexIndicator]="showRowIndexIndicator"
        [showSelectionColumn]="showSelectionColumn"
        [rowClickSelect]="rowClickSelect"
        [pageSize]="pageSize"
        [disabled]="disabled"
      />
    `,
  }),
};
