import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { type CardVariant, UICard } from "../../card.component";
import { UICardStoryHeaderMedia } from "./header-media.story";

const meta = {
  title: "@theredhead/UI Kit/Card",
  component: UICardStoryHeaderMedia,
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
  decorators: [moduleMetadata({ imports: [UICardStoryHeaderMedia] })],
} satisfies Meta<UICardStoryHeaderMedia>;

export default meta;
type Story = StoryObj;

export const HeaderMedia: Story = {
  render: () => ({
    template: "<ui-card-story-header-media />",
  }),
};
