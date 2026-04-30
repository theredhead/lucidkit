import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableViewStoryDemo } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Table View",
  component: UITableViewStoryDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITableView` is a full-featured data table with pluggable datasources, declarative columns, sorting, pagination, row selection, and density control.",
      },
    },
  },
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
  decorators: [moduleMetadata({ imports: [UITableViewStoryDemo] })]
} satisfies Meta<object>;

export default meta;
type Story = StoryObj<object>;

export const Documentation: Story = {
  tags: ["!dev"],
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
        ].join("\n")
      }
    }
  },
  render: () => ({
      template: "<ui-table-view-story-demo />",
    })
};
