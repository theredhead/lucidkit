import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BadgeColor, UIBadge } from "../../badge.component";

import { DotStorySource } from "./dot.story";

interface DotStoryArgs {
  color: BadgeColor;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: DotStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small status indicator that conveys a numeric count, a presence dot, " +
          "or a short text label.",
      },
    },
  },
  argTypes: {
    color: {
      control: "select",
      options: [
        "primary",
        "success",
        "warning",
        "danger",
        "neutral",
      ] satisfies BadgeColor[],
      description:
        "Semantic colour preset. Maps to `--ui-badge-bg` and " +
        "`--ui-badge-text` CSS custom properties.",
    },
  },
  decorators: [moduleMetadata({ imports: [DotStorySource] })],
} satisfies Meta<DotStoryArgs>;

export default meta;
type Story = StoryObj<DotStoryArgs>;

export const Dot: Story = {
  args: { color: "success" },
  parameters: {
    controls: {
      include: ["color"],
    },
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: '<ui-dot-story-demo [color]="color" />',
  }),
};
