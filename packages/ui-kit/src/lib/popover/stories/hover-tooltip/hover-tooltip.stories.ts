import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { HoverTooltipStorySource } from "./hover-tooltip.story";

const meta = {
  title: "@theredhead/UI Kit/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          '`PopoverService` provides an imperative API for opening floating popover panels anchored to any DOM element. It uses the native Popover API (`popover="auto"` or `popover="manual"`) for stacking and light-dismiss behaviour.',
      },
    },
  },
  decorators: [moduleMetadata({ imports: [HoverTooltipStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const HoverTooltip: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-hover-tooltip-story-demo />",
    })
};
