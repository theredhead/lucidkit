import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type SkeletonVariant, UISkeleton } from "../../skeleton.component";

import { SkeletonDemo } from "./showcase.story";

const meta = {
  title: "@theredhead/UI Kit/Skeleton",
  component: SkeletonDemo,
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
  decorators: [moduleMetadata({ imports: [SkeletonDemo] })]
} satisfies Meta<SkeletonDemo>;

export default meta;
type Story = StoryObj<SkeletonDemo>;

export const Showcase: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-skeleton-demo />",
    })
};
