import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { MixedMediaStorySource } from "./mixed-media.story";

const meta = {
  title: "@theredhead/UI Kit/Media Gallery",
  component: MixedMediaStorySource,
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [MixedMediaStorySource] })],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Fullscreen mixed-media viewer for UIImage and UIMediaPlayer hosts. " +
          "Items with the same gallery attribute value share a collection; " +
          "plain gallery attributes share the unnamed collection.",
      },
    },
  },
} satisfies Meta<MixedMediaStorySource>;

export default meta;
type Story = StoryObj<MixedMediaStorySource>;

export const MixedMedia: Story = {};
