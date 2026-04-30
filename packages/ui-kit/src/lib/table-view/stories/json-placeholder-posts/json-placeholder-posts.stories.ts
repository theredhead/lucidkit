import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableViewStoryDemo } from "./json-placeholder-posts.story";

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
    docs: {}
  },
  render: () => ({
      template: "<ui-table-view-story-demo />",
    })
};
