import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITreeView } from "../../tree-view.component";

import { TreeViewSelectionDemo } from "./selection.story";

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
  decorators: [moduleMetadata({ imports: [TreeViewSelectionDemo] })]
} satisfies Meta<UITreeView>;

export default meta;
type Story = StoryObj<UITreeView>;

export const Selection: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-tree-view-selection-demo />",
    })
};
