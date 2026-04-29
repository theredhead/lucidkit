import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ActionMenuDemo } from "./action-menu.story";

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
  decorators: [moduleMetadata({ imports: [ActionMenuDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ActionMenu: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-popover-action-menu-demo />",
    })
};
