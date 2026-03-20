import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";

import { UIMediaPlayer } from "./media-player.component";
import {
  MEDIA_EMBED_PROVIDERS,
  youTubeEmbedProvider,
} from "./media-player.providers";
import type {
  MediaEmbedConfig,
  MediaEmbedProvider,
  MediaSource,
  MediaTrack,
  MediaType,
  MediaFit,
  MediaPreload,
} from "./media-player.types";

@Component({
  standalone: true,
  imports: [UIMediaPlayer],
  template: `
    <ui-media-player
      [type]="type()"
      [source]="source()"
      [sources]="sources()"
      [tracks]="tracks()"
      [controls]="controls()"
      [loop]="loop()"
      [(muted)]="muted"
      [(volume)]="volume"
      [autoplay]="autoplay()"
      [preload]="preload()"
      [fit]="fit()"
      [poster]="poster()"
      [ariaLabel]="ariaLabel()"
      [playbackRates]="playbackRates()"
    />
  `,
})
class TestHost {
  public readonly type = signal<MediaType>("video");
  public readonly source = signal<MediaSource | null>(null);
  public readonly sources = signal<readonly MediaSource[]>([]);
  public readonly tracks = signal<readonly MediaTrack[]>([]);
  public readonly controls = signal(true);
  public readonly loop = signal(false);
  public readonly muted = signal(false);
  public readonly volume = signal(1);
  public readonly autoplay = signal(false);
  public readonly preload = signal<MediaPreload>("metadata");
  public readonly fit = signal<MediaFit>("contain");
  public readonly poster = signal<string>("");
  public readonly ariaLabel = signal("Media player");
  public readonly playbackRates = signal<readonly number[]>([0.5, 1, 1.5, 2]);
}

describe("UIMediaPlayer", () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.nativeElement.querySelector("ui-media-player")).toBeTruthy();
  });

  it("should have ui-media-player host class", () => {
    expect(
      fixture.nativeElement.querySelector("ui-media-player").classList,
    ).toContain("ui-media-player");
  });

  describe("type", () => {
    it("should default to video mode", () => {
      expect(
        fixture.nativeElement.querySelector("ui-media-player").classList,
      ).toContain("ui-media-player--video");
    });

    it("should render a video element in video mode", () => {
      const video = fixture.nativeElement.querySelector("video");
      expect(video).toBeTruthy();
    });

    it("should switch to audio mode", () => {
      host.type.set("audio");
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector("ui-media-player").classList,
      ).toContain("ui-media-player--audio");
      expect(fixture.nativeElement.querySelector("audio")).toBeTruthy();
      expect(fixture.nativeElement.querySelector("video")).toBeFalsy();
    });
  });

  describe("controls", () => {
    it("should show controls by default", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".mp-controls")).toBeTruthy();
    });

    it("should hide controls when controls is false", () => {
      host.controls.set(false);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector("ui-media-player").classList,
      ).toContain("ui-media-player--no-controls");
    });

    it("should render play/pause button", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".mp-btn--play")).toBeTruthy();
    });

    it("should render mute button", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".mp-btn--mute")).toBeTruthy();
    });

    it("should render volume slider", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".mp-volume-slider"),
      ).toBeTruthy();
    });

    it("should render progress bar", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".mp-progress")).toBeTruthy();
    });

    it("should render rate button", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector(".mp-btn--rate")).toBeTruthy();
    });

    it("should render fullscreen button for video mode", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".mp-btn--fullscreen"),
      ).toBeTruthy();
    });

    it("should not render fullscreen button for audio mode", () => {
      host.type.set("audio");
      host.source.set({ url: "test.mp3", type: "audio/mpeg" });
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".mp-btn--fullscreen"),
      ).toBeFalsy();
    });
  });

  describe("sources", () => {
    it("should render source elements from single source", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      const sources = fixture.nativeElement.querySelectorAll("source");
      expect(sources.length).toBe(1);
      expect(sources[0].type).toBe("video/mp4");
    });

    it("should render multiple source elements", () => {
      host.sources.set([
        { url: "test.webm", type: "video/webm" },
        { url: "test.mp4", type: "video/mp4" },
      ]);
      fixture.detectChanges();
      const sources = fixture.nativeElement.querySelectorAll("source");
      expect(sources.length).toBe(2);
    });

    it("should prepend single source to multi sources", () => {
      host.source.set({ url: "primary.mp4", type: "video/mp4" });
      host.sources.set([{ url: "fallback.webm", type: "video/webm" }]);
      fixture.detectChanges();
      const sources = fixture.nativeElement.querySelectorAll("source");
      expect(sources.length).toBe(2);
    });
  });

  describe("tracks", () => {
    it("should render track elements", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      host.tracks.set([
        {
          kind: "subtitles",
          src: "/subs/en.vtt",
          srcLang: "en",
          label: "English",
          default: true,
        },
        {
          kind: "subtitles",
          src: "/subs/fr.vtt",
          srcLang: "fr",
          label: "French",
        },
      ]);
      fixture.detectChanges();
      const tracks = fixture.nativeElement.querySelectorAll("track");
      expect(tracks.length).toBe(2);
      expect(tracks[0].kind).toBe("subtitles");
      expect(tracks[0].srclang).toBe("en");
    });
  });

  describe("poster", () => {
    it("should set poster attribute when explicitly provided", () => {
      host.poster.set("poster.jpg");
      fixture.detectChanges();
      const video = fixture.nativeElement.querySelector("video");
      expect(video.poster).toContain("poster.jpg");
    });

    it("should show placeholder when no poster is set and no frame captured", () => {
      host.poster.set("");
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        ".mp-poster-placeholder",
      );
      expect(placeholder).toBeTruthy();
    });

    it("should not show placeholder when explicit poster is provided", () => {
      host.poster.set("poster.jpg");
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        ".mp-poster-placeholder",
      );
      expect(placeholder).toBeFalsy();
    });

    it("should not show placeholder in audio mode", () => {
      host.type.set("audio");
      host.poster.set("");
      fixture.detectChanges();
      const placeholder = fixture.nativeElement.querySelector(
        ".mp-poster-placeholder",
      );
      expect(placeholder).toBeFalsy();
    });

    it("should default to empty poster (auto-generation on load)", () => {
      const video = fixture.nativeElement.querySelector("video");
      // No explicit poster, no data loaded yet — poster attr should be absent
      expect(video.getAttribute("poster")).toBeNull();
    });
  });

  describe("accessibility", () => {
    it("should set aria-label on media element", () => {
      host.ariaLabel.set("Custom player");
      fixture.detectChanges();
      const video = fixture.nativeElement.querySelector("video");
      expect(video.getAttribute("aria-label")).toBe("Custom player");
    });

    it("should have toolbar role on controls", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      const controls = fixture.nativeElement.querySelector(".mp-controls");
      expect(controls.getAttribute("role")).toBe("toolbar");
    });

    it("should have slider role on progress bar", () => {
      host.source.set({ url: "test.mp4", type: "video/mp4" });
      fixture.detectChanges();
      const progress = fixture.nativeElement.querySelector(".mp-progress");
      expect(progress.getAttribute("role")).toBe("slider");
    });
  });

  describe("preload", () => {
    it("should set preload attribute", () => {
      host.preload.set("auto");
      fixture.detectChanges();
      const video = fixture.nativeElement.querySelector("video");
      expect(video.getAttribute("preload")).toBe("auto");
    });
  });

  describe("state", () => {
    it("should default to paused", () => {
      const player = fixture.nativeElement.querySelector("ui-media-player");
      expect(player.classList).toContain("ui-media-player--paused");
    });

    it("should default error to null", () => {
      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      expect(player.state().error).toBeNull();
      expect(player.hasError()).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should show error overlay in video mode when error occurs", () => {
      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      // Simulate an error state
      player.state.update((s) => ({
        ...s,
        error: {
          code: 2,
          message: "A network error prevented the media from loading.",
        },
      }));
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector(".mp-error-overlay");
      expect(overlay).toBeTruthy();
      expect(overlay.getAttribute("role")).toBe("alert");
      expect(overlay.textContent).toContain("network error");
    });

    it("should add --error host class when in error state", () => {
      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      player.state.update((s) => ({
        ...s,
        error: { code: 4, message: "The media format is not supported." },
      }));
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector("ui-media-player");
      expect(el.classList).toContain("ui-media-player--error");
    });

    it("should not show poster placeholder when error is active", () => {
      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      player.state.update((s) => ({
        ...s,
        error: {
          code: 2,
          message: "A network error prevented the media from loading.",
        },
      }));
      fixture.detectChanges();

      const placeholder = fixture.nativeElement.querySelector(
        ".mp-poster-placeholder",
      );
      expect(placeholder).toBeFalsy();
    });

    it("should show error banner in audio mode when error occurs", () => {
      host.type.set("audio");
      fixture.detectChanges();

      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      player.state.update((s) => ({
        ...s,
        error: { code: 4, message: "The media format is not supported." },
      }));
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector(".mp-error-banner");
      expect(banner).toBeTruthy();
      expect(banner.getAttribute("role")).toBe("alert");
      expect(banner.textContent).toContain("format is not supported");
    });

    it("should not show error overlay in audio mode", () => {
      host.type.set("audio");
      fixture.detectChanges();

      const player = fixture.debugElement.children[0]
        .componentInstance as UIMediaPlayer;
      player.state.update((s) => ({
        ...s,
        error: { code: 2, message: "Network error" },
      }));
      fixture.detectChanges();

      const overlay = fixture.nativeElement.querySelector(".mp-error-overlay");
      expect(overlay).toBeFalsy();
    });

    it("should not show error UI when no error", () => {
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector(".mp-error-overlay"),
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(".mp-error-banner"),
      ).toBeFalsy();
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Embed provider integration tests                                  */
/* ------------------------------------------------------------------ */

@Component({
  standalone: true,
  imports: [UIMediaPlayer],
  template: `
    <ui-media-player
      [type]="type()"
      [source]="source()"
      [controls]="controls()"
      [ariaLabel]="ariaLabel()"
    />
  `,
})
class EmbedTestHost {
  public readonly type = signal<MediaType>("video");
  public readonly source = signal<MediaSource | null>(null);
  public readonly controls = signal(true);
  public readonly ariaLabel = signal("Media player");
}

describe("UIMediaPlayer — embed providers", () => {
  describe("with YouTube provider", () => {
    let fixture: ComponentFixture<EmbedTestHost>;
    let host: EmbedTestHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmbedTestHost],
        providers: [
          {
            provide: MEDIA_EMBED_PROVIDERS,
            useValue: youTubeEmbedProvider,
            multi: true,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(EmbedTestHost);
      host = fixture.componentInstance;
    });

    it("should render iframe for YouTube URL", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(".mp-embed-iframe");
      expect(iframe).toBeTruthy();
      expect(iframe.tagName).toBe("IFRAME");
    });

    it("should set correct embed src", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(
        ".mp-embed-iframe",
      ) as HTMLIFrameElement;
      expect(iframe.src).toContain("https://www.youtube.com/embed/dQw4w9WgXcQ");
    });

    it("should add --embed host class", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector("ui-media-player");
      expect(el.classList).toContain("ui-media-player--embed");
    });

    it("should not render native video element for embed URL", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("video")).toBeFalsy();
    });

    it("should not render controls toolbar for embed", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      host.controls.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(".mp-controls")).toBeFalsy();
    });

    it("should set allowfullscreen on iframe", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(
        ".mp-embed-iframe",
      ) as HTMLIFrameElement;
      expect(iframe.allowFullscreen).toBe(true);
    });

    it("should forward aria-label to iframe", () => {
      host.ariaLabel.set("YouTube video");
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(
        ".mp-embed-iframe",
      ) as HTMLIFrameElement;
      expect(iframe.getAttribute("aria-label")).toBe("YouTube video");
    });

    it("should render embed viewport with aspect-ratio", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(
        ".mp-viewport--embed",
      );
      expect(viewport).toBeTruthy();
    });
  });

  describe("with no providers registered", () => {
    let fixture: ComponentFixture<EmbedTestHost>;
    let host: EmbedTestHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmbedTestHost],
        // No MEDIA_EMBED_PROVIDERS provided
      }).compileComponents();
      fixture = TestBed.createComponent(EmbedTestHost);
      host = fixture.componentInstance;
    });

    it("should render native video for any URL when no providers are registered", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("video")).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(".mp-embed-iframe"),
      ).toBeFalsy();
    });

    it("should not add --embed host class", () => {
      host.source.set({
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector("ui-media-player");
      expect(el.classList).not.toContain("ui-media-player--embed");
    });
  });

  describe("with custom provider", () => {
    const customProvider: MediaEmbedProvider = {
      name: "TestTube",
      resolve(url: string): MediaEmbedConfig | null {
        try {
          const parsed = new URL(url);
          if (parsed.hostname === "testtube.example.com") {
            const id = parsed.pathname.split("/").pop();
            return {
              iframeSrc: `https://testtube.example.com/embed/${id}`,
              providerName: "TestTube",
              aspectRatio: "4 / 3",
            };
          }
        } catch {
          /* ignore */
        }
        return null;
      },
    };

    let fixture: ComponentFixture<EmbedTestHost>;
    let host: EmbedTestHost;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [EmbedTestHost],
        providers: [
          {
            provide: MEDIA_EMBED_PROVIDERS,
            useValue: customProvider,
            multi: true,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(EmbedTestHost);
      host = fixture.componentInstance;
    });

    it("should resolve custom provider URLs", () => {
      host.source.set({
        url: "https://testtube.example.com/videos/abc123",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(
        ".mp-embed-iframe",
      ) as HTMLIFrameElement;
      expect(iframe).toBeTruthy();
      expect(iframe.src).toContain("https://testtube.example.com/embed/abc123");
    });

    it("should use custom aspect ratio", () => {
      host.source.set({
        url: "https://testtube.example.com/videos/abc123",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const viewport = fixture.nativeElement.querySelector(
        ".mp-viewport--embed",
      );
      expect(viewport.style.aspectRatio).toBe("4 / 3");
    });

    it("should fall back to native player for non-matching URLs", () => {
      host.source.set({
        url: "https://other-site.com/video.mp4",
        type: "video/mp4",
      });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector("video")).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(".mp-embed-iframe"),
      ).toBeFalsy();
    });

    it("should use custom provider name in title", () => {
      host.source.set({
        url: "https://testtube.example.com/videos/abc123",
        type: "video/mp4",
      });
      fixture.detectChanges();

      const iframe = fixture.nativeElement.querySelector(
        ".mp-embed-iframe",
      ) as HTMLIFrameElement;
      expect(iframe.title).toBe("TestTube player");
    });
  });
});
