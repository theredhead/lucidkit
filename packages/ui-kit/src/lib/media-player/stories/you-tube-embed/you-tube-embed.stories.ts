import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";


import { YouTubeEmbedStorySource } from "./you-tube-embed.story";

const meta = {
  title: "@theredhead/UI Kit/Media Player",
  component: YouTubeEmbedStorySource,
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
  decorators: [moduleMetadata({ imports: [YouTubeEmbedStorySource] })],
} satisfies Meta<YouTubeEmbedStorySource>;

export default meta;
type Story = StoryObj<YouTubeEmbedStorySource>;

export const YouTubeEmbed: Story = {
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-you-tube-embed-story-demo />",
  }),
};
