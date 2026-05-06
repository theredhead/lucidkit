import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { InteractiveStorySource } from "./interactive.story";

const meta = {
  title: "@theredhead/UI Kit/Gauge",
  component: InteractiveStorySource,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [moduleMetadata({ imports: [InteractiveStorySource] })],
} satisfies Meta<InteractiveStorySource>;

export default meta;
type Story = StoryObj<InteractiveStorySource>;

export const Interactive: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-interactive-story-demo />",
  }),
};
