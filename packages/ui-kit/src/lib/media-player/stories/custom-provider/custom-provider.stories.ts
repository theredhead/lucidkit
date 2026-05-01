import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIMediaPlayer } from "../../media-player.component";

import { CustomProviderStorySource } from "./custom-provider.story";

const meta = {
  title: "@theredhead/UI Kit/Media Player",
  component: CustomProviderStorySource,
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
  argTypes: {
    // ── Inputs ──
    type: {
      control: "inline-radio",
      options: ["video", "audio"],
      description: "The type of media element to render.",
      table: { category: "Inputs", defaultValue: { summary: '"video"' } },
    },
    source: {
      control: "object",
      description:
        "The media source — an object with `url` (string) and `type` (MIME), " +
        "or `blob` (Blob) and `type`.",
      table: { category: "Inputs", defaultValue: { summary: "null" } },
    },
    sources: {
      control: "object",
      description:
        "Multiple sources for format fallback. Rendered as `<source>` elements.",
      table: { category: "Inputs", defaultValue: { summary: "[]" } },
    },
    tracks: {
      control: "object",
      description:
        "Text tracks (subtitles, captions, chapters, metadata). " +
        "Each entry maps to a native `<track>` element.",
      table: { category: "Inputs", defaultValue: { summary: "[]" } },
    },
    controls: {
      control: "boolean",
      description: "Whether to show built-in transport controls.",
      table: { category: "Inputs", defaultValue: { summary: "true" } },
    },
    loop: {
      control: "boolean",
      description: "Whether playback should loop.",
      table: { category: "Inputs", defaultValue: { summary: "false" } },
    },
    autoplay: {
      control: "boolean",
      description: "Whether to autoplay when a source is set.",
      table: { category: "Inputs", defaultValue: { summary: "false" } },
    },
    preload: {
      control: "inline-radio",
      options: ["none", "metadata", "auto"],
      description: "Resource preload strategy for the media element.",
      table: { category: "Inputs", defaultValue: { summary: '"metadata"' } },
    },
    fit: {
      control: "select",
      options: ["contain", "cover", "fill", "none", "scale-down"],
      description:
        "How video is fitted within the viewport (CSS `object-fit`).",
      table: { category: "Inputs", defaultValue: { summary: '"contain"' } },
    },
    poster: {
      control: "text",
      description:
        "Poster image URL shown before playback begins (video only). " +
        "When omitted the component auto-captures a frame from the loaded video.",
      table: { category: "Inputs", defaultValue: { summary: '""' } },
    },
    crossOrigin: {
      control: "inline-radio",
      options: ["anonymous", "use-credentials"],
      description:
        "CORS setting for the underlying media element. " +
        "Defaults to `anonymous` for cross-origin poster-frame generation.",
      table: { category: "Inputs", defaultValue: { summary: '"anonymous"' } },
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the media player region.",
      table: {
        category: "Inputs",
        defaultValue: { summary: '"Media player"' },
      },
    },
    playbackRates: {
      control: "object",
      description: "Available playback rates for the rate selector.",
      table: {
        category: "Inputs",
        defaultValue: { summary: "[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]" },
      },
    },

    // ── Two-way bindings ──
    muted: {
      control: "boolean",
      description:
        "Whether the media should start muted. Supports two-way binding `[(muted)]`.",
      table: {
        category: "Two-way bindings",
        defaultValue: { summary: "false" },
      },
    },
    volume: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        "Volume level `0..1`. Supports two-way binding `[(volume)]`.",
      table: { category: "Two-way bindings", defaultValue: { summary: "1" } },
    },

    // ── Outputs ──
    mediaPlay: {
      description: "Emitted when playback begins.",
      table: { category: "Outputs" },
    },
    mediaPause: {
      description: "Emitted when playback is paused.",
      table: { category: "Outputs" },
    },
    mediaEnded: {
      description: "Emitted when playback ends.",
      table: { category: "Outputs" },
    },
    mediaTimeUpdate: {
      description:
        "Emitted when the current time changes (throttled to animation frames).",
      table: { category: "Outputs" },
    },
    mediaLoadedMetadata: {
      description: "Emitted when metadata (duration, dimensions) has loaded.",
      table: { category: "Outputs" },
    },
    mediaError: {
      description: "Emitted on playback error.",
      table: { category: "Outputs" },
    },
  },
  decorators: [moduleMetadata({ imports: [CustomProviderStorySource] })]
} satisfies Meta<CustomProviderStorySource>;

export default meta;
type Story = StoryObj<CustomProviderStorySource>;

export const CustomProvider: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-custom-provider-story-demo />",
    })
};
