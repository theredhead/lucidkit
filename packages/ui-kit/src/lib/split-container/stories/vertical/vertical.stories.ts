import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISplitContainer } from "../../split-container.component";

import { VerticalStorySource } from "./vertical.story";

const meta = {
  title: "@theredhead/UI Kit/Split Container",
  component: VerticalStorySource,
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
  decorators: [moduleMetadata({ imports: [VerticalStorySource] })]
} satisfies Meta<VerticalStorySource>;

export default meta;
type Story = StoryObj<VerticalStorySource>;

export const Vertical: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-vertical-story-demo />",
    })
};
