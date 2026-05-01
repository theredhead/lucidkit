import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CardVariant, UICard } from "../../card.component";
import { UICardStoryBodyImage } from "./body-image.story";

const meta = {
  title: "@theredhead/UI Kit/Card",
  component: UICardStoryBodyImage,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile content container with optional header, body, and footer " +
          "projection slots. `ui-card-header` also supports an optional leading icon or avatar.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outlined", "filled"] satisfies CardVariant[],
      description: "Controls elevation, border, and background treatment.",
    },
    interactive: {
      control: "boolean",
      description:
        "When `true`, the card responds to hover/focus with elevation change and lift effect.",
    },
  },
  decorators: [moduleMetadata({ imports: [UICardStoryBodyImage] })],
} satisfies Meta<UICardStoryBodyImage>;

export default meta;
type Story = StoryObj;

export const BodyImage: Story = {
  render: () => ({
    template: "<ui-card-story-body-image />",
  }),
};
