import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type BadgeColor,
  type BadgeVariant,
} from "../../badge.component";

import { DefaultStorySource } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: DefaultStorySource,
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
    muted: {
      control: "boolean",
      description: "Use a softer surface treatment instead of a filled colour.",
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
  decorators: [moduleMetadata({ imports: [DefaultStorySource] })],
} satisfies Meta<DefaultStorySource>;

export default meta;
type Story = StoryObj<DefaultStorySource>;

export const Default: Story = {
  args: {
    variant: "count",
    color: "danger",
    muted: false,
    count: 5,
    maxCount: 99,
  },
  render: (args) => ({
    props: args,
    template: "<ui-default-story-demo />",
  }),
};
