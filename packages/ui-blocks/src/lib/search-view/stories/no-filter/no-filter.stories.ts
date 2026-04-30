import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { NoFilterDemo } from "./no-filter.story";

const meta = {
  title: "@theredhead/UI Blocks/Search View",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "`UISearchView` is a unified browse-and-filter layout that composes `UIFilter`, `UITableView` (or a custom results template), and `UIPagination` into a single search screen.",
          "",
          "## Layout Modes",
          "",
          "- **Table** (default) — project `<ui-text-column>` / `<ui-template-column>` children to define the table.",
          "- **Custom** — project an `#results` template to render items however you like (card grid, list, etc.).",
          "",
          "## Filter",
          "",
          "The filter section auto-detects when the datasource is a `FilterableArrayDatasource` and infers field definitions from columns and data types. Override with `[filterFields]` or project a `#filter` template for full control.",
          "",
          "## CSS Custom Properties",
          "",
          "`--ui-surface`, `--ui-text`, `--ui-border`, `--ui-bg`, `--ui-filter-bg`",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    title: {
      control: "text",
      description: "Title displayed in the header area.",
    },
    layout: {
      control: "select",
      options: ["table", "custom"],
      description: "Layout mode for results.",
    },
    showFilter: {
      control: "boolean",
      description: "Show the filter section.",
    },
    filterExpanded: {
      control: "boolean",
      description: "Whether the filter starts expanded.",
    },
    filterModeLocked: {
      control: "boolean",
      description: "Hide the filter toggle button.",
    },
    showPagination: {
      control: "boolean",
      description: "Show the pagination footer.",
    },
    pageSize: {
      control: "number",
      description: "Items per page.",
    },
    placeholder: {
      control: "text",
      description: "Empty-state text.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the search view.",
    },
  },
  decorators: [moduleMetadata({ imports: [NoFilterDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const NoFilter: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-search-view-no-filter-demo />",
    })
};
