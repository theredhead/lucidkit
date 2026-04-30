import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { FilterDemo } from "./with-filter.story";

const meta = {
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
          "| `datasource` | `IDatasource<T> \\| ITreeDatasource<T>` | — | Datasource powering the list (table or tree mode) |",
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
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed above the list panel.",
    },
    placeholder: {
      control: "text",
      description: "Text shown when no item is selected.",
    },
    showFilter: {
      control: "boolean",
      description: "Show the collapsible filter bar.",
    },
    filterExpanded: {
      control: "boolean",
      description: "Whether the filter starts expanded.",
    },
    filterModeLocked: {
      control: "boolean",
      description: "Hide the filter toggle button.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the embedded table.",
    },
    showBuiltInPaginator: {
      control: "boolean",
      description: "Show the built-in paginator.",
    },
    showRowIndexIndicator: {
      control: "boolean",
      description: "Show row index numbers.",
    },
    resizable: {
      control: "boolean",
      description: "Allow column resizing.",
    },
    caption: {
      control: "text",
      description: "Accessible caption for the table.",
    },
  },
  decorators: [moduleMetadata({ imports: [FilterDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const WithFilter: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-mdv-filter-demo />",
    })
};
