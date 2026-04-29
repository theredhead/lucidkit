import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIEmptyState } from "../../empty-state.component";
import { UIEmptyStateStoryDefault } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Empty State",
  component: UIEmptyState,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [UIEmptyStateStoryDefault] })],
  argTypes: {
    heading: {
      control: "text",
      description: "Primary heading.",
    },
    message: {
      control: "text",
      description: "Optional explanatory message.",
    },
    icon: {
      control: "text",
      description: "SVG inner-content for the illustration icon.",
    },
    iconSize: {
      control: { type: "number", min: 16, max: 96, step: 8 },
      description: "Icon size in px.",
    },
  },
} satisfies Meta<UIEmptyState>;

export default meta;
type Story = StoryObj<UIEmptyState>;

export const Default: Story = {
  args: {
    heading: "No results found",
    message: "Try adjusting your filters or search query.",
  },
  render: (args) => ({
    props: args,
    template:
      "<ui-empty-state-story-default [heading]=\"heading\" [message]=\"message\" />",
  }),
};