import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIRating, type RatingSize } from "../../rating.component";

import { RatingDemo } from "./showcase.story";

const meta = {
  title: "@theredhead/UI Kit/Rating",
  component: RatingDemo,
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
  decorators: [moduleMetadata({ imports: [RatingDemo] })]
} satisfies Meta<RatingDemo>;

export default meta;
type Story = StoryObj<RatingDemo>;

export const Showcase: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-rating-demo />",
    })
};
