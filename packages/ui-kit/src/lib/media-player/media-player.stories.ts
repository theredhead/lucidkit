import {
  Meta,
  StoryObj,
  moduleMetadata,
  applicationConfig,
} from "@storybook/angular";
import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIMediaPlayer } from "./media-player.component";
import {
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
  vimeoEmbedProvider,
  dailymotionEmbedProvider,
} from "./media-player.providers";
import type {
  MediaSource,
  MediaTrack,
  MediaEmbedConfig,
  MediaEmbedProvider,
} from "./media-player.types";

// Local sample media served from public/media/ via Storybook's staticDirs.
// Avoids external dependencies and 429 rate-limiting on repeated reloads.
const SAMPLE_VIDEO: MediaSource = {
  url: "/media/sample.mp4",
  type: "video/mp4",
};

const SAMPLE_POSTER = "/media/sample-poster.jpg";

const SAMPLE_AUDIO: MediaSource = {
  url: "/media/sample.m4a",
  type: "audio/mp4",
};

const SAMPLE_TRACKS: readonly MediaTrack[] = [
  {
    kind: "subtitles",
    src: "https://raw.githubusercontent.com/nicmart/subtitles/master/tests/Fixtures/sampleSRT.vtt",
    srcLang: "en",
    label: "English",
    default: true,
  },
];

@Component({
  selector: "ui-media-player-video-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">Video player</h4>
      <ui-media-player
        type="video"
        [source]="source"
        [poster]="poster"
        ariaLabel="Sample video"
      />
    </div>
  `,
})
class MediaPlayerVideoDemo {
  public readonly source: MediaSource = SAMPLE_VIDEO;
  public readonly poster = SAMPLE_POSTER;
}

@Component({
  selector: "ui-media-player-audio-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 480px">
      <h4 style="margin: 0 0 8px">Audio player</h4>
      <ui-media-player
        type="audio"
        [source]="source"
        ariaLabel="Sample audio"
      />
    </div>
  `,
})
class MediaPlayerAudioDemo {
  public readonly source: MediaSource = SAMPLE_AUDIO;
}

@Component({
  selector: "ui-media-player-tracks-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">Video with subtitles</h4>
      <ui-media-player
        type="video"
        [source]="source"
        [tracks]="tracks"
        [poster]="poster"
        ariaLabel="Video with subtitles"
      />
    </div>
  `,
})
class MediaPlayerTracksDemo {
  public readonly source: MediaSource = SAMPLE_VIDEO;
  public readonly tracks: readonly MediaTrack[] = SAMPLE_TRACKS;
  public readonly poster = SAMPLE_POSTER;
}

@Component({
  selector: "ui-media-player-blob-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 480px">
      <h4 style="margin: 0 0 8px">Audio from Blob</h4>
      <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
        Click "Generate" to create a synthesised tone Blob and play it.
      </p>
      <button (click)="generateTone()" style="margin-bottom: 12px">
        Generate tone
      </button>
      @if (blobSource()) {
        <ui-media-player
          type="audio"
          [source]="blobSource()!"
          ariaLabel="Generated tone"
        />
      }
    </div>
  `,
})
class MediaPlayerBlobDemo {
  public readonly blobSource = signal<MediaSource | null>(null);

  public generateTone(): void {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dest = ctx.createMediaStreamDestination();
    oscillator.connect(dest);
    oscillator.frequency.value = 440;
    oscillator.start();

    const recorder = new MediaRecorder(dest.stream);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      this.blobSource.set({ blob, type: "audio/webm" });
    };
    recorder.start();
    setTimeout(() => {
      oscillator.stop();
      recorder.stop();
      ctx.close();
    }, 2000);
  }
}

@Component({
  selector: "ui-media-player-no-controls-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">No built-in controls (programmatic)</h4>
      <ui-media-player
        #player
        type="video"
        [source]="source"
        [poster]="poster"
        [controls]="false"
        ariaLabel="Programmatic player"
      />
      <div style="margin-top: 8px; display: flex; gap: 8px">
        <button (click)="player.playMedia()">Play</button>
        <button (click)="player.pauseMedia()">Pause</button>
        <button (click)="player.seekTo(0)">Restart</button>
        <button (click)="player.toggleMute()">Toggle Mute</button>
      </div>
    </div>
  `,
})
class MediaPlayerNoControlsDemo {
  public readonly source: MediaSource = SAMPLE_VIDEO;
  public readonly poster = SAMPLE_POSTER;
}

@Component({
  selector: "ui-media-player-youtube-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">YouTube embed</h4>
      <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
        Pass a YouTube URL as the source — the player automatically renders a
        YouTube embed iframe.
      </p>
      <ui-media-player
        type="video"
        [source]="source"
        ariaLabel="YouTube video"
      />
    </div>
  `,
})
class MediaPlayerYouTubeDemo {
  public readonly source: MediaSource = {
    url: "https://www.youtube.com/watch?v=YE7VzlLtp-4",
    type: "video/mp4",
  };
}

@Component({
  selector: "ui-media-player-vimeo-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">Vimeo embed</h4>
      <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
        Pass a Vimeo URL as the source — the player automatically renders a
        Vimeo embed iframe.
      </p>
      <ui-media-player type="video" [source]="source" ariaLabel="Vimeo video" />
    </div>
  `,
})
class MediaPlayerVimeoDemo {
  public readonly source: MediaSource = {
    url: "https://vimeo.com/76979871",
    type: "video/mp4",
  };
}

/** Custom provider used in the extensibility demo. */
const peertubeDemoProvider: MediaEmbedProvider = {
  name: "PeerTube Demo",
  resolve(url: string): MediaEmbedConfig | null {
    try {
      const parsed = new URL(url);
      if (parsed.hostname.endsWith(".joinpeertube.org")) {
        const match = parsed.pathname.match(/\/w\/([a-zA-Z0-9-]+)/);
        if (match) {
          return {
            iframeSrc: `https://${parsed.hostname}/videos/embed/${match[1]}`,
            providerName: "PeerTube Demo",
          };
        }
      }
    } catch {
      /* ignore malformed URLs */
    }
    return null;
  },
};

@Component({
  selector: "ui-media-player-custom-provider-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="max-width: 640px">
      <h4 style="margin: 0 0 8px">Custom embed provider (extensibility)</h4>
      <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
        Consumers can register custom embed providers via DI. This demo adds a
        PeerTube provider alongside the built-in YouTube/Vimeo ones.
      </p>
      <div style="display: flex; flex-direction: column; gap: 16px">
        @for (src of sources; track src.url) {
          <div>
            <code
              style="font-size: 0.75rem; opacity: 0.6; display: block; margin-bottom: 4px"
            >
              {{ src.url }}
            </code>
            <ui-media-player
              type="video"
              [source]="src"
              ariaLabel="Custom provider demo"
            />
          </div>
        }
      </div>
    </div>
  `,
})
class MediaPlayerCustomProviderDemo {
  public readonly sources: readonly MediaSource[] = [
    { url: "https://www.youtube.com/watch?v=YE7VzlLtp-4", type: "video/mp4" },
    { url: "https://vimeo.com/76979871", type: "video/mp4" },
  ];
}

@Component({
  selector: "ui-media-player-error-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 640px"
    >
      <div>
        <h4 style="margin: 0 0 8px">Video error — overlay</h4>
        <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
          When a video source cannot be loaded the player shows a full-viewport
          error overlay with the theme's error colour.
        </p>
        <ui-media-player
          type="video"
          [source]="source"
          ariaLabel="Broken video"
        />
      </div>
      <div>
        <h4 style="margin: 0 0 8px">Audio error — banner</h4>
        <p style="font-size: 0.875rem; opacity: 0.7; margin: 0 0 12px">
          Audio mode renders a compact error banner above the controls.
        </p>
        <ui-media-player
          type="audio"
          [source]="source"
          ariaLabel="Broken audio"
        />
      </div>
    </div>
  `,
})
class MediaPlayerErrorDemo {
  public readonly source: MediaSource = {
    url: "/media/this-video-does-not-exist.mp4",
    type: "video/mp4",
  };
}

const meta: Meta<UIMediaPlayer> = {
  title: "@theredhead/UI Kit/Media Player",
  component: UIMediaPlayer,
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
  decorators: [
    moduleMetadata({
      imports: [
        MediaPlayerVideoDemo,
        MediaPlayerAudioDemo,
        MediaPlayerTracksDemo,
        MediaPlayerBlobDemo,
        MediaPlayerNoControlsDemo,
        MediaPlayerYouTubeDemo,
        MediaPlayerVimeoDemo,
        MediaPlayerCustomProviderDemo,
        MediaPlayerErrorDemo,
      ],
    }),
    applicationConfig({
      providers: [
        provideMediaEmbedProviders(
          youTubeEmbedProvider,
          vimeoEmbedProvider,
          dailymotionEmbedProvider,
          peertubeDemoProvider,
        ),
      ],
    }),
  ],
};
export default meta;
type Story = StoryObj<UIMediaPlayer>;

/**
 * **Interactive playground** — use the controls panel to tweak every
 * input in real time. This is the primary story and serves as the
 * autodocs default.
 */
export const Playground: Story = {
  args: {
    type: "video",
    source: SAMPLE_VIDEO,
    sources: [],
    tracks: [],
    controls: true,
    loop: false,
    muted: false,
    volume: 1,
    autoplay: false,
    preload: "metadata",
    fit: "contain",
    poster: SAMPLE_POSTER,
    crossOrigin: "anonymous",
    ariaLabel: "Sample video",
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  },
  render: (args) => ({
    props: {
      ...args,
      onPlay: () => console.log("▶ play"),
      onPause: () => console.log("⏸ pause"),
      onEnded: () => console.log("⏹ ended"),
      onTimeUpdate: () => {},
      onLoadedMetadata: (e: unknown) => console.log("ℹ loadedmetadata", e),
      onError: (e: unknown) => console.log("⚠ error", e),
    },
    template: `
      <div style="max-width: 640px">
        <ui-media-player
          [type]="type"
          [source]="source"
          [sources]="sources"
          [tracks]="tracks"
          [controls]="controls"
          [loop]="loop"
          [muted]="muted"
          [volume]="volume"
          [autoplay]="autoplay"
          [preload]="preload"
          [fit]="fit"
          [poster]="poster"
          [crossOrigin]="crossOrigin"
          [ariaLabel]="ariaLabel"
          [playbackRates]="playbackRates"
          (mediaPlay)="onPlay()"
          (mediaPause)="onPause()"
          (mediaEnded)="onEnded()"
          (mediaTimeUpdate)="onTimeUpdate()"
          (mediaLoadedMetadata)="onLoadedMetadata($event)"
          (mediaError)="onError($event)"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="video"
  [source]="videoSource"
  poster="/assets/poster.jpg"
  ariaLabel="My video"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="video"
      [source]="videoSource"
      poster="/assets/poster.jpg"
      ariaLabel="My video"
    />
  \\\`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://example.com/video.mp4',
    type: 'video/mp4',
  };
}

// ── SCSS ──
/* No custom styles needed — the player handles its own theming. */
`,
      },
    },
  },
};

/**
 * Static video demo — identical to Playground but using a wrapper
 * component without Storybook controls.
 */
export const Video: Story = {
  render: () => ({
    template: `<ui-media-player-video-demo />`,
  }),
};

/**
 * Audio player with a compact control bar. No video viewport is
 * rendered — only the transport controls.
 */
export const Audio: Story = {
  render: () => ({
    template: `<ui-media-player-audio-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="audio"
  [source]="audioSource"
  ariaLabel="Podcast episode"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="audio"
      [source]="audioSource"
      ariaLabel="Podcast episode"
    />
  \\\`,
})
export class ExampleComponent {
  readonly audioSource: MediaSource = {
    url: '/assets/episode.mp3',
    type: 'audio/mpeg',
  };
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Video player with subtitle tracks attached. The browser's
 * native text-track UI is used for track selection.
 */
export const WithTracks: Story = {
  render: () => ({
    template: `<ui-media-player-tracks-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="video"
  [source]="videoSource"
  [tracks]="subtitles"
  poster="/assets/movie-poster.jpg"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource, MediaTrack } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="video"
      [source]="videoSource"
      [tracks]="subtitles"
      poster="/assets/movie-poster.jpg"
    />
  \\\`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: '/assets/movie.mp4',
    type: 'video/mp4',
  };
  readonly subtitles: MediaTrack[] = [
    { kind: 'subtitles', src: '/subs/en.vtt', srcLang: 'en', label: 'English', default: true },
    { kind: 'subtitles', src: '/subs/fr.vtt', srcLang: 'fr', label: 'French' },
  ];
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Demonstrates playing audio generated as an in-memory Blob.
 * Click "Generate" to synthesise a 2-second 440 Hz tone.
 */
export const BlobSource: Story = {
  render: () => ({
    template: `<ui-media-player-blob-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="audio"
  [source]="blobSource"
/>

// ── TypeScript ──
import { Component, signal } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player type="audio" [source]="blobSource()" />
  \\\`,
})
export class ExampleComponent {
  readonly blobSource = signal<MediaSource>({
    blob: myAudioBlob,       // any Blob / File with audio data
    type: 'audio/webm',
  });
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Player with `[controls]="false"`. The consumer drives playback
 * entirely via the component's public API: `playMedia()`,
 * `pauseMedia()`, `seekTo()`, `toggleMute()`, etc.
 */
export const Programmatic: Story = {
  render: () => ({
    template: `<ui-media-player-no-controls-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  #player
  type="video"
  [source]="videoSource"
  poster="/assets/poster.jpg"
  [controls]="false"
/>
<button (click)="player.playMedia()">Play</button>
<button (click)="player.pauseMedia()">Pause</button>
<button (click)="player.seekTo(0)">Restart</button>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player #player type="video" [source]="src" poster="/assets/poster.jpg" [controls]="false" />
    <button (click)="player.playMedia()">Play</button>
    <button (click)="player.pauseMedia()">Pause</button>
  \\\`,
})
export class ExampleComponent {
  readonly src: MediaSource = { url: '/video.mp4', type: 'video/mp4' };
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * YouTube URL passed as the source. The built-in `youTubeEmbedProvider`
 * detects the URL, extracts the video ID, and renders a YouTube embed
 * iframe instead of a native `<video>` element.
 *
 * Register the provider via `provideMediaEmbedProviders(youTubeEmbedProvider)`
 * in your app config.
 */
export const YouTubeEmbed: Story = {
  render: () => ({
    template: `<ui-media-player-youtube-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="video"
  [source]="videoSource"
  ariaLabel="YouTube video"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
} from '@theredhead/ui-kit';

// In your app config or route providers:
// provideMediaEmbedProviders(youTubeEmbedProvider)

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="YouTube video"
    />
  \\\`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'video/mp4',
  };
}

// ── SCSS ──
/* No custom styles needed — the embed iframe fills the player viewport. */
`,
      },
    },
  },
};

/**
 * Vimeo URL passed as the source. Works the same way as YouTube —
 * register `vimeoEmbedProvider` in your DI tree.
 */
export const VimeoEmbed: Story = {
  render: () => ({
    template: `<ui-media-player-vimeo-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="video"
  [source]="videoSource"
  ariaLabel="Vimeo video"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  provideMediaEmbedProviders,
  vimeoEmbedProvider,
} from '@theredhead/ui-kit';

// In your app config or route providers:
// provideMediaEmbedProviders(vimeoEmbedProvider)

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="Vimeo video"
    />
  \\\`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://vimeo.com/76979871',
    type: 'video/mp4',
  };
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Demonstrates the extensibility of the embed system. A custom
 * \`MediaEmbedProvider\` for PeerTube is registered alongside the
 * built-in YouTube and Vimeo providers. Any URL that matches the
 * custom provider's \`resolve()\` logic will render an embed iframe.
 */
export const CustomProvider: Story = {
  render: () => ({
    template: `<ui-media-player-custom-provider-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-media-player
  type="video"
  [source]="videoSource"
  ariaLabel="PeerTube video"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import {
  UIMediaPlayer,
  MediaSource,
  MediaEmbedProvider,
  MediaEmbedConfig,
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
  vimeoEmbedProvider,
} from '@theredhead/ui-kit';

// 1. Implement the MediaEmbedProvider interface
const peertubeProvider: MediaEmbedProvider = {
  name: 'PeerTube',
  resolve(url: string): MediaEmbedConfig | null {
    try {
      const parsed = new URL(url);
      const match = parsed.pathname.match(/\\/w\\/([a-zA-Z0-9-]+)/);
      if (match) {
        return {
          iframeSrc: \\\`https://\\\${parsed.hostname}/videos/embed/\\\${match[1]}\\\`,
          providerName: 'PeerTube',
        };
      }
    } catch { /* ignore */ }
    return null;
  },
};

// 2. Register providers in your app config
// provideMediaEmbedProviders(
//   youTubeEmbedProvider,
//   vimeoEmbedProvider,
//   peertubeProvider,
// )

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player
      type="video"
      [source]="videoSource"
      ariaLabel="PeerTube video"
    />
  \\\`,
})
export class ExampleComponent {
  readonly videoSource: MediaSource = {
    url: 'https://videos.joinpeertube.org/w/some-video-id',
    type: 'video/mp4',
  };
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Demonstrates both error-state variants: the full-viewport overlay
 * for video and the compact inline banner for audio.
 */
export const ErrorState: Story = {
  render: () => ({
    template: `<ui-media-player-error-demo />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<!-- Video: full-viewport error overlay -->
<ui-media-player
  type="video"
  [source]="brokenSource"
  ariaLabel="Broken video"
/>

<!-- Audio: compact error banner -->
<ui-media-player
  type="audio"
  [source]="brokenSource"
  ariaLabel="Broken audio"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIMediaPlayer, MediaSource } from '@theredhead/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIMediaPlayer],
  template: \\\`
    <ui-media-player type="video" [source]="brokenSource" ariaLabel="Broken video" />
    <ui-media-player type="audio" [source]="brokenSource" ariaLabel="Broken audio" />
  \\\`,
})
export class ExampleComponent {
  readonly brokenSource: MediaSource = {
    url: '/assets/does-not-exist.mp4',
    type: 'video/mp4',
  };
}

// ── SCSS ──
/* Error styling is automatic via --theredhead-error theme token. */
`,
      },
    },
  },
};
