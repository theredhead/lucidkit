import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISplitContainer } from "../../split-container.component";

import { DoubleClickCollapseStorySource } from "./double-click-collapse.story";

const meta = {
  title: "@theredhead/UI Kit/Split Container",
  component: UISplitContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISplitContainer` is a resizable N-panel layout. Place any number of `<ui-split-panel>` children inside — dividers are automatically inserted between adjacent panels. Each divider only ever adjusts its two immediately adjacent panels.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the panels.",
    },
    dividerWidth: {
      control: "number",
      description: "Width of the draggable divider in pixels.",
    },
    disabled: {
      control: "boolean",
      description: "Disables resizing.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for each resize handle.",
    },
  },
  decorators: [moduleMetadata({ imports: [DoubleClickCollapseStorySource] })]
} satisfies Meta<UISplitContainer>;

export default meta;
type Story = StoryObj<UISplitContainer>;

export const DoubleClickCollapse: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-double-click-collapse-story-demo />",
    })
};
