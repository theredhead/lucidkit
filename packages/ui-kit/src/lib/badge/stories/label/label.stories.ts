import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type BadgeColor, UIBadge } from "../../badge.component";

import { LabelStorySource } from "./label.story";

interface LabelStoryArgs {
  color: BadgeColor;
  label: string;
}

const meta = {
  title: "@theredhead/UI Kit/Badge",
  component: LabelStorySource,
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
    label: {
      control: "text",
      description: "Short text shown inside the label badge.",
    },
  },
  decorators: [moduleMetadata({ imports: [LabelStorySource] })],
} satisfies Meta<LabelStoryArgs>;

export default meta;
type Story = StoryObj<LabelStoryArgs>;

export const Label: Story = {
  args: {
    color: "primary",
    label: "New",
  },
  parameters: {
    controls: {
      include: ["color", "label"],
    },
    docs: {},
  },
  render: (args) => ({
    props: args,
    template: '<ui-label-story-demo [color]="color" [label]="label" />',
  }),
};
