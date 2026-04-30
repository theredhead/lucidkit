import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDensity } from "../../../ui-density";

import { UITableViewStoryDemo } from "./density-playground.story";

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

export const DensityPlayground: Story = {
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
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-table-view-story-demo />",
    })
};
