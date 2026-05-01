import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type SkeletonVariant, UISkeleton } from "../../skeleton.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Skeleton",
  component: DefaultStorySource,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rect", "circle"] satisfies SkeletonVariant[],
      description: "Shape of the placeholder.",
    },
    lines: {
      control: { type: "number", min: 1, max: 10 },
      description: "Number of text lines (text variant only).",
    },
    width: {
      control: "text",
      description: "CSS width applied to the host.",
    },
    height: {
      control: "text",
      description: "CSS height applied to the host (rect/circle only).",
    },
    animated: {
      control: "boolean",
      description: "Enable the shimmer animation.",
    },
  },
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })]
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: {
    variant: "text",
    lines: 3,
    width: "360px",
    height: "1rem",
    animated: true,
  },
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-default-story-demo />",
    })
};
