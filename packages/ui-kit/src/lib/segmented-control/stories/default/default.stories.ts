import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISegmentedControl } from "../../segmented-control.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Segmented Control",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Active segment id." },
    disabled: {
      control: "boolean",
      description: "Disable the entire control.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: { disabled: false },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
