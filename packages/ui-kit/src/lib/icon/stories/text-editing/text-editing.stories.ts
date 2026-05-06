import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";
import { UIIcons } from "../../lucide-icons.generated";

import { TextEditingStorySource } from "./text-editing.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: TextEditingStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders an inline SVG icon from a raw SVG string. The library ships " +
          "a categorised icon registry (`UIIcons.Lucide`) generated from the " +
          "[Lucide](https://lucide.dev) icon set, but you can also create and use " +
          "**your own custom icons**.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [TextEditingStorySource] })],
} satisfies Meta<TextEditingStorySource>;

export default meta;
type Story = StoryObj<TextEditingStorySource>;

export const TextEditing: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: `<ui-story-icon-text-editing />`,
  }),
};
