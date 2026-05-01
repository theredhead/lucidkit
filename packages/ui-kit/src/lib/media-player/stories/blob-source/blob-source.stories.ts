import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";


import { BlobSourceStorySource } from "./blob-source.story";

const meta = {
  title: "@theredhead/UI Kit/Media Player",
  component: BlobSourceStorySource,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A versatile media player supporting audio and video playback " +
          "from URL sources or in-memory Blobs. Features built-in " +
          "transport controls (play/pause, seek, volume, playback rate, " +
          "fullscreen) that can be hidden for fully custom UIs. Supports " +
          "text tracks (subtitles, captions, chapters) via native `<track>` elements. " +
          "Third-party platforms (YouTube, Vimeo, Dailymotion) are supported " +
          "via an extensible embed provider system registered through Angular DI.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [BlobSourceStorySource] })],
} satisfies Meta<BlobSourceStorySource>;

export default meta;
type Story = StoryObj<BlobSourceStorySource>;

export const BlobSource: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-blob-source-story-demo />",
  }),
};
