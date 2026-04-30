import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BadgeColor, UIBadge } from "../../badge.component";

import { OverflowStorySource } from "./overflow.story";

interface OverflowStoryArgs {
  color: BadgeColor;
  count: number;
  maxCount: number;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: OverflowStorySource,
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
    count: {
      control: "number",
      description:
        "Numeric value displayed when `variant` is `count`. " +
        "Clamped to `maxCount` with a `+` suffix when exceeded.",
    },
    maxCount: {
      control: "number",
      description:
        "Upper display limit for the `count` variant. Counts above this " +
        'threshold render as `maxCount+` (e.g. "99+"). Defaults to `99`.',
    },
  },
  decorators: [moduleMetadata({ imports: [OverflowStorySource] })],
} satisfies Meta<OverflowStoryArgs>;

export default meta;
type Story = StoryObj<OverflowStoryArgs>;

export const Overflow: Story = {
  args: {
    color: "danger",
    count: 128,
    maxCount: 99,
  },
  parameters: {
    controls: {
      include: ["color", "count", "maxCount"],
    },
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-overflow-story-demo [count]="count" [color]="color" [maxCount]="maxCount" />',
  }),
};
