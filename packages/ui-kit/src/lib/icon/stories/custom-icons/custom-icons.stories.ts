import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";

import { CustomIconsStorySource } from "./custom-icons.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: CustomIconsStorySource,
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
  decorators: [moduleMetadata({ imports: [CustomIconsStorySource] })],
} satisfies Meta<CustomIconsStorySource>;

export default meta;
type Story = StoryObj<CustomIconsStorySource>;

export const CustomIcons: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: `<ui-story-icon-custom-icons />`,
  }),
};
