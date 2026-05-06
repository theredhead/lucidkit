import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { VerticalDemo } from "./vertical.story";

const meta = {
  title: "@theredhead/UI Blocks/Master Detail View",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [VerticalDemo] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  name: "Vertical orientation",
  parameters: {
    docs: {
      description: {
        story:
          'Set `orientation="vertical"` to stack the list above the detail panel. ' +
          "This layout works well when the list has three or more columns and needs more horizontal space.",
      },
    },
  },
  render: () => ({
    template: "<ui-mdv-vertical-demo />",
  }),
};
