import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRating, type RatingSize } from "../../rating.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Rating",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 10 },
      description: "Current value.",
    },
    max: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum stars.",
    },
    readonly: { control: "boolean", description: "Display-only mode." },
    disabled: { control: "boolean", description: "Disable input." },
    size: {
      control: "select",
      options: ["small", "medium", "large"] satisfies RatingSize[],
      description: "Visual size.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: { value: 3, max: 5, readonly: false, disabled: false, size: "medium" },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
