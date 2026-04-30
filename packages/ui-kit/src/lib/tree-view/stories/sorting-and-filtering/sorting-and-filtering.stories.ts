import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITreeView } from "../../tree-view.component";

import { TreeViewSortFilterDemo } from "./sorting-and-filtering.story";

const meta = {
  title: "@theredhead/UI Kit/Tree View",
  component: UITreeView,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UITreeView` renders hierarchical data as an expandable / collapsible tree.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the tree view.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the tree.",
    },
  },
  decorators: [moduleMetadata({ imports: [TreeViewSortFilterDemo] })]
} satisfies Meta<UITreeView>;

export default meta;
type Story = StoryObj<UITreeView>;

export const SortingAndFiltering: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-tree-view-sort-filter-demo />",
    })
};
