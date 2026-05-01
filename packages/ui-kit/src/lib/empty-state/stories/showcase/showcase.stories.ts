import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIButton } from "../../../button/button.component";
import { UIEmptyState } from "../../empty-state.component";
import { UIEmptyStateStoryShowcase } from "./showcase.story";

const meta = {
  title: "@theredhead/UI Kit/Empty State",
  component: UIEmptyStateStoryShowcase,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({ imports: [UIEmptyStateStoryShowcase, UIButton] }),
  ],
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
} satisfies Meta<UIEmptyStateStoryShowcase>;

export default meta;
type Story = StoryObj<UIEmptyStateStoryShowcase>;

export const Showcase: Story = {
  render: () => ({
    template: "<ui-empty-state-story-showcase />",
  }),
};
