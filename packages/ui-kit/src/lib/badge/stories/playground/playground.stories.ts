import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type BadgeColor,
  type BadgeVariant,
  UIBadge,
} from "../../badge.component";

import { PlaygroundStorySource } from "./playground.story";

interface PlaygroundStoryArgs {
  ariaLabel?: string;
  color: BadgeColor;
  count: number;
  label: string;
  maxCount: number;
  variant: BadgeVariant;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: PlaygroundStorySource,
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
    variant: {
      control: "select",
      options: ["count", "dot", "label"] satisfies BadgeVariant[],
      description:
        "Controls the visual shape: `count` shows a number, `dot` shows a " +
        "small circle, `label` renders projected text content.",
    },
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
  decorators: [moduleMetadata({ imports: [PlaygroundStorySource] })],
} satisfies Meta<PlaygroundStoryArgs>;

export default meta;
type Story = StoryObj<PlaygroundStoryArgs>;

export const Playground: Story = {
  args: {
    variant: "count",
    color: "primary",
    count: 5,
    maxCount: 99,
    ariaLabel: "Notification badge",
    label: "Label",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Projected text used by the label variant.",
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-playground-story-demo [variant]="variant" [color]="color" [count]="count" [maxCount]="maxCount" [ariaLabel]="ariaLabel" [label]="label" />',
  }),
};
