import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITreeView } from "../../tree-view.component";

import { TreeViewExpandDemo } from "./expand-collapse.story";

const meta = {
  title: "@theredhead/UI Kit/Tree View",
  component: TreeViewExpandDemo,
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
  decorators: [moduleMetadata({ imports: [TreeViewExpandDemo] })]
} satisfies Meta<TreeViewExpandDemo>;

export default meta;
type Story = StoryObj<TreeViewExpandDemo>;

export const ExpandCollapse: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-tree-view-expand-demo />",
    })
};
