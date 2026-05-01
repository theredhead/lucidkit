import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIIcon } from "../../icon.component";

import { StoryIconGallery } from "./gallery.story";

const meta = {
  title: "@theredhead/UI Kit/Icon",
  component: StoryIconGallery,
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
  decorators: [moduleMetadata({ imports: [StoryIconGallery] })]
} satisfies Meta<StoryIconGallery>;

export default meta;
type Story = StoryObj<StoryIconGallery>;

export const Gallery: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-icon-gallery />",
    })
};
