import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BadgeColor, UIBadge } from "../../badge.component";

import { CountStorySource } from "./count.story";

interface CountStoryArgs {
  color: BadgeColor;
  count: number;
  maxCount: number;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: CountStorySource,
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
  decorators: [moduleMetadata({ imports: [CountStorySource] })],
} satisfies Meta<CountStoryArgs>;

export default meta;
type Story = StoryObj<CountStoryArgs>;

export const Count: Story = {
  args: { count: 5, color: "danger", maxCount: 99 },
  parameters: {
    controls: {
      include: ["color", "count", "maxCount"],
    },
    docs: {
      description: {
        story:
          "### Variants\n" +
          "| Variant | Purpose | Example |\n" +
          "|---------|---------|---------|\n" +
          "| `count` | Numeric notification badge | Unread messages (5) |\n" +
          "| `dot` | Presence / status indicator | Online status |\n" +
          '| `label` | Short text tag | "New", "Beta" |\n\n' +
          "### Colors\n" +
          "`primary` · `success` · `warning` · `danger` · `neutral`\n\n" +
          "### Overflow\n" +
          "When `count` exceeds `maxCount`, the badge displays `maxCount+` " +
          '(e.g. "99+").',
      },
    },
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-count-story-demo [count]="count" [color]="color" [maxCount]="maxCount" />',
  }),
};
