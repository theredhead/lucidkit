import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ManualDismissDemo } from "./manual-dismiss.story";

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
  decorators: [moduleMetadata({ imports: [ManualDismissDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ManualDismiss: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-popover-manual-demo />",
    })
};
