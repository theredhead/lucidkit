import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { AlignmentStorySource } from "./alignment.story";

const meta = {
  title: "@theredhead/UI Kit/Dropdown Menu",
  component: AlignmentStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A dropdown action menu triggered by a button or custom element.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [AlignmentStorySource] })],
} satisfies Meta<AlignmentStorySource>;

export default meta;
type Story = StoryObj<AlignmentStorySource>;

export const Alignment: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-alignment-story-demo />",
  }),
};
