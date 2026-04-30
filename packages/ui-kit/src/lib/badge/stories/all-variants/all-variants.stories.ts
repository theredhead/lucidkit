import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import {
  type BadgeColor,
  type BadgeVariant,
  UIBadge,
} from "../../badge.component";

import { AllVariantsStorySource } from "./all-variants.story";

interface BadgeDocsArgs {
  color: BadgeColor;
  count: number;
  maxCount: number;
  variant: BadgeVariant;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: AllVariantsStorySource,
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
  decorators: [moduleMetadata({ imports: [AllVariantsStorySource] })],
} satisfies Meta<BadgeDocsArgs>;

export default meta;
type Story = StoryObj<BadgeDocsArgs>;

export const AllVariants: Story = {
  parameters: {
    controls: {
      disable: true,
    },
    docs: {},
  },
  render: () => ({
    template: "<ui-all-variants-story-demo />",
  }),
};
