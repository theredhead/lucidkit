import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { DomSanitizer, type SafeResourceUrl } from "@angular/platform-browser";

import { LoggerFactory } from "@theredhead/foundation";

import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { MEDIA_EMBED_PROVIDERS } from "./media-player.providers";
import type {
  MediaCrossOrigin,
  MediaEmbedConfig,
  MediaEmbedProvider,
  MediaErrorInfo,
  MediaFit,
  MediaPlayerEvent,
  MediaPlayerState,
  MediaPreload,
  MediaSource,
  MediaTrack,
  MediaType,
} from "./media-player.types";

/**
 * A versatile media player supporting audio and video playback from
 * URL sources or in-memory binary blobs.
 *
 * Built-in transport controls (play/pause, seek, volume, mute,
 * playback rate, fullscreen) are shown by default but can be hidden
 * via `[controls]="false"` for fully custom UIs that drive the
 * player programmatically.
 *
 * Text tracks (subtitles, captions, chapters, etc.) are supported
 * via the `[tracks]` input and rendered as native `<track>` elements,
 * leaving room for future expansion.
 *
 * @example
 * ```html
 * <!-- Video from URL — poster auto-generated if omitted -->
 * <ui-media-player
 *   type="video"
 *   [source]="{ url: 'https://example.com/video.mp4', type: 'video/mp4' }"
 * />
 *
 * <!-- Explicit poster -->
 * <ui-media-player
 *   type="video"
 *   [source]="{ url: 'https://example.com/video.mp4', type: 'video/mp4' }"
 *   poster="https://example.com/poster.jpg"
 * />
 *
 * <!-- YouTube embed (requires registering youTubeEmbedProvider) -->
 * <ui-media-player
 *   type="video"
 *   [source]="{ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }"
 * />
 *
 * <!-- Audio from Blob -->
 * <ui-media-player
 *   type="audio"
 *   [source]="{ blob: audioBlob, type: 'audio/wav' }"
 *   [controls]="true"
 * />
 * ```
 */
@Component({
  selector: "ui-media-player",
  standalone: true,
  imports: [UIIcon],
  templateUrl: "./media-player.component.html",
  styleUrl: "./media-player.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-media-player",
    "[class.ui-media-player--audio]": "type() === 'audio'",
    "[class.ui-media-player--video]": "type() === 'video'",
    "[class.ui-media-player--playing]": "state().playing",
    "[class.ui-media-player--paused]": "state().paused",
    "[class.ui-media-player--ended]": "state().ended",
    "[class.ui-media-player--no-controls]": "!controls()",
    "[class.ui-media-player--error]": "hasError()",
    "[class.ui-media-player--embed]": "isEmbed()",
    "[class.ui-media-player--disabled]": "disabled()",
  },
})
export class UIMediaPlayer {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the media player is disabled. */
  public readonly disabled = input<boolean>(false);

  /** The type of media element to render. */
  public readonly type = input<MediaType>("video");

  /** The media source (URL or Blob). */
  public readonly source = input<MediaSource | null>(null);

  /**
   * Multiple sources for format fallback.
   *
   * When provided, these are rendered as `<source>` elements inside
   * the media element, giving the browser format negotiation.
   * If `source` is also set it is prepended to this list.
   */
  public readonly sources = input<readonly MediaSource[]>([]);

  /** Text tracks (subtitles, captions, chapters, metadata). */
  public readonly tracks = input<readonly MediaTrack[]>([]);

  /** Whether to show built-in transport controls. */
  public readonly controls = input(true);

  /** Whether playback should loop. */
  public readonly loop = input(false);

  /** Whether the media should start muted. */
  public readonly muted = model(false);

  /** Initial volume `0..1`. */
  public readonly volume = model(1);

  /** Whether to autoplay when a source is set. */
  public readonly autoplay = input(false);

  /** Resource preload strategy. */
  public readonly preload = input<MediaPreload>("metadata");

  /** How video is fitted within the viewport (CSS `object-fit`). */
  public readonly fit = input<MediaFit>("contain");

  /**
   * Poster image URL shown before playback begins (video only).
   *
   * When omitted (or set to an empty string) the component
   * automatically captures a frame from the loaded video and
   * uses it as the poster, so there is always a meaningful
   * preview instead of a black rectangle.
   */
  public readonly poster = input<string>("");

  /**
   * CORS setting for the underlying media element.
   *
   * Defaults to `'anonymous'` so that cross-origin videos can be
   * drawn to a canvas for automatic poster-frame generation.
   * Set to `null` to omit the attribute entirely (disables
   * poster auto-generation for cross-origin resources).
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
   */
  public readonly crossOrigin = input<MediaCrossOrigin | null>("anonymous");

  /** Accessible label for the media player region. */
  public readonly ariaLabel = input<string>("Media player");

  /** Available playback rates for the rate selector. */
  public readonly playbackRates = input<readonly number[]>([
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
  ]);

  // ── Outputs ─────────────────────────────────────────────────────────

  /** Emitted when playback begins. */
  public readonly mediaPlay = output<MediaPlayerEvent>();

  /** Emitted when playback is paused. */
  public readonly mediaPause = output<MediaPlayerEvent>();

  /** Emitted when playback ends. */
  public readonly mediaEnded = output<MediaPlayerEvent>();

  /** Emitted when the current time changes (throttled to animation frames). */
  public readonly mediaTimeUpdate = output<MediaPlayerEvent>();

  /** Emitted when metadata (duration, dimensions) has loaded. */
  public readonly mediaLoadedMetadata = output<MediaPlayerEvent>();

  /** Emitted on playback error. */
  public readonly mediaError = output<MediaPlayerEvent>();

  // ── View queries ────────────────────────────────────────────────────

  /** @internal Reference to the native `<video>` element. */
  protected readonly videoRef =
    viewChild<ElementRef<HTMLVideoElement>>("videoEl");

  /** @internal Reference to the native `<audio>` element. */
  protected readonly audioRef =
    viewChild<ElementRef<HTMLAudioElement>>("audioEl");

  // ── Computed ────────────────────────────────────────────────────────

  /** @internal The resolved list of media sources. */
  protected readonly resolvedSources = computed<readonly MediaSource[]>(() => {
    const single = this.source();
    const multi = this.sources();
    return single ? [single, ...multi] : [...multi];
  });

  /** @internal Resolved source URLs (creates Object URLs for blobs). */
  protected readonly sourceEntries = computed(() => {
    return this.resolvedSources().map((s) => ({
      src: s.blob ? URL.createObjectURL(s.blob) : (s.url ?? ""),
      type: s.type,
    }));
  });

  /** @internal Whether any source is available. */
  protected readonly hasSource = computed(
    () => this.resolvedSources().length > 0,
  );

  /**
   * @internal Auto-generated poster data-URL captured from the
   * first usable video frame when no explicit poster is provided.
   */
  protected readonly generatedPoster = signal<string>("");

  /**
   * @internal The poster URL that will actually be applied.
   * Explicit `poster()` wins; otherwise falls back to the
   * auto-generated frame capture.
   */
  protected readonly resolvedPoster = computed(
    () => this.poster() || this.generatedPoster(),
  );

  /** @internal Whether a poster (explicit or generated) is available. */
  protected readonly hasPoster = computed(() => !!this.resolvedPoster());

  /**
   * @internal Resolved embed configuration from the first matching
   * provider, or `null` for native playback.
   */
  protected readonly resolvedEmbed = computed<MediaEmbedConfig | null>(() => {
    const src = this.source();
    if (!src?.url) return null;

    for (const provider of this.embedProviders) {
      const config = provider.resolve(src.url);
      if (config) return config;
    }
    return null;
  });

  /**
   * Whether the player is in embed (iframe) mode rather than
   * native `<video>` / `<audio>` playback.
   */
  public readonly isEmbed = computed(() => this.resolvedEmbed() !== null);

  /**
   * @internal Trusted iframe `src` URL for the current embed.
   * Only meaningful when `isEmbed()` is `true`.
   */
  protected readonly embedIframeSrc = computed<SafeResourceUrl | null>(() => {
    const embed = this.resolvedEmbed();
    if (!embed) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed.iframeSrc);
  });

  /**
   * @internal CSS `aspect-ratio` for the embed viewport.
   */
  protected readonly embedAspectRatio = computed(() => {
    return this.resolvedEmbed()?.aspectRatio ?? "16 / 9";
  });

  /** @internal Current playback state snapshot. */
  public readonly state = signal<MediaPlayerState>({
    playing: false,
    paused: true,
    ended: false,
    currentTime: 0,
    duration: NaN,
    buffered: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    error: null,
  });

  /** Whether the player is in an error state. */
  public readonly hasError = computed(() => this.state().error !== null);

  /**
   * @internal Human-readable error message for display in the
   * error overlay. Returns an empty string when healthy.
   */
  protected readonly errorMessage = computed(() => {
    const err = this.state().error;
    return err ? err.message : "";
  });

  /** @internal Whether the rate picker popup is open. */
  protected readonly ratePickerOpen = signal(false);

  /** @internal Current seek position as percentage for the progress bar. */
  protected readonly progressPercent = computed(() => {
    const s = this.state();
    if (!s.duration || isNaN(s.duration)) return 0;
    return (s.currentTime / s.duration) * 100;
  });

  /** @internal Current buffered percentage. */
  protected readonly bufferedPercent = computed(() => {
    return this.state().buffered * 100;
  });

  /** @internal Formatted current time string. */
  protected readonly currentTimeFormatted = computed(() =>
    this.formatTime(this.state().currentTime),
  );

  /** @internal Formatted duration string. */
  protected readonly durationFormatted = computed(() => {
    const d = this.state().duration;
    return isNaN(d) ? "--:--" : this.formatTime(d);
  });

  // ── Public fields ───────────────────────────────────────────────────

  /** SVG content for the error state icon (Lucide CircleAlert). */
  public readonly errorIcon = UIIcons.Lucide.Notifications.CircleAlert;

  // ── Private fields ──────────────────────────────────────────────────

  private readonly log = inject(LoggerFactory).createLogger("UIMediaPlayer");
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly embedProviders: readonly MediaEmbedProvider[] =
    inject(MEDIA_EMBED_PROVIDERS, { optional: true }) ?? [];

  /** Object URLs created for blob sources that need revoking. */
  private readonly blobUrls: string[] = [];

  /** RAF handle for time-update throttling. */
  private rafId: number | null = null;

  // ── Constructor ─────────────────────────────────────────────────────

  public constructor() {
    afterNextRender(() => {
      this.syncInitialState();
    });

    this.destroyRef.onDestroy(() => {
      this.revokeBlobUrls();
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
    });
  }

  // ── Public methods ──────────────────────────────────────────────────

  /** Start or resume playback. */
  public playMedia(): void {
    const el = this.mediaElement();
    if (!el) return;
    el.play().catch((err) => this.log.error("Playback failed", [err]));
  }

  /** Pause playback. */
  public pauseMedia(): void {
    this.mediaElement()?.pause();
  }

  /** Toggle between play and pause. */
  public togglePlay(): void {
    const el = this.mediaElement();
    if (!el) return;
    if (el.paused || el.ended) {
      this.playMedia();
    } else {
      this.pauseMedia();
    }
  }

  /** Seek to a specific time in seconds. */
  public seekTo(time: number): void {
    const el = this.mediaElement();
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(time, el.duration || 0));
  }

  /** Set the playback volume (`0..1`). */
  public setVolume(vol: number): void {
    const el = this.mediaElement();
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, vol));
    this.volume.set(el.volume);
  }

  /** Toggle mute state. */
  public toggleMute(): void {
    const el = this.mediaElement();
    if (!el) return;
    el.muted = !el.muted;
    this.muted.set(el.muted);
  }

  /** Set the playback rate. */
  public setPlaybackRate(rate: number): void {
    const el = this.mediaElement();
    if (!el) return;
    el.playbackRate = rate;
    this.updateState();
  }

  /** Request fullscreen on the media element (video only). */
  public requestFullscreen(): void {
    const el = this.mediaElement();
    if (!el || this.type() !== "video") return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch((err) =>
        this.log.warn("Fullscreen request denied", [err]),
      );
    }
  }

  // ── Protected template event handlers ───────────────────────────────

  /** @internal Handle click on the progress bar to seek. */
  protected onProgressClick(event: MouseEvent): void {
    const el = this.mediaElement();
    if (!el || isNaN(el.duration)) return;
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const fraction = (event.clientX - rect.left) / rect.width;
    this.seekTo(fraction * el.duration);
  }

  /** @internal Handle volume slider input. */
  protected onVolumeInput(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.setVolume(value);
  }

  /** @internal Handle playback rate selection. */
  protected onRateSelect(rate: number): void {
    this.setPlaybackRate(rate);
    this.ratePickerOpen.set(false);
  }

  /** @internal Toggle rate picker visibility. */
  protected toggleRatePicker(): void {
    this.ratePickerOpen.update((v) => !v);
  }

  /** @internal Bind native media events. */
  protected onMediaEvent(eventName: string): void {
    switch (eventName) {
      case "play":
        this.updateState();
        this.mediaPlay.emit({ nativeElement: this.mediaElement()! });
        break;
      case "pause":
        this.updateState();
        this.mediaPause.emit({ nativeElement: this.mediaElement()! });
        break;
      case "ended":
        this.updateState();
        this.mediaEnded.emit({ nativeElement: this.mediaElement()! });
        break;
      case "timeupdate":
        this.throttledUpdateState();
        this.mediaTimeUpdate.emit({ nativeElement: this.mediaElement()! });
        break;
      case "loadedmetadata":
        this.clearError();
        this.updateState();
        this.mediaLoadedMetadata.emit({ nativeElement: this.mediaElement()! });
        break;
      case "loadeddata":
        this.clearError();
        this.updateState();
        this.capturePosterFrame();
        break;
      case "volumechange":
        this.updateState();
        break;
      case "progress":
        this.updateState();
        break;
      case "error":
        this.handleMediaError();
        break;
    }
  }

  // ── Private methods ─────────────────────────────────────────────────

  /** @internal Get the active native media element. */
  private mediaElement(): HTMLMediaElement | null {
    if (this.type() === "video") {
      return this.videoRef()?.nativeElement ?? null;
    }
    return this.audioRef()?.nativeElement ?? null;
  }

  /** @internal Sync model values to the native element on first render. */
  private syncInitialState(): void {
    const el = this.mediaElement();
    if (!el) return;
    el.volume = this.volume();
    el.muted = this.muted();
  }

  /**
   * @internal Map a native `MediaError` to a user-friendly message
   * and update the component state.
   */
  private handleMediaError(): void {
    const el = this.mediaElement();
    const native = el?.error;
    const info = this.toMediaErrorInfo(native ?? null);

    this.log.error("Media error", [info]);
    this.state.update((s) => ({ ...s, error: info }));

    if (el) {
      this.mediaError.emit({ nativeElement: el });
    }
  }

  /**
   * @internal Clear any previous error (e.g. after a successful
   * source change or metadata load).
   */
  private clearError(): void {
    if (this.state().error) {
      this.state.update((s) => ({ ...s, error: null }));
    }
  }

  /**
   * @internal Convert a native `MediaError` (or `null`) into a
   * structured {@link MediaErrorInfo} with a human-readable message.
   */
  private toMediaErrorInfo(native: MediaError | null): MediaErrorInfo {
    if (!native) {
      return { code: 0, message: "An unknown playback error occurred." };
    }
    switch (native.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        return { code: native.code, message: "Playback was aborted." };
      case MediaError.MEDIA_ERR_NETWORK:
        return {
          code: native.code,
          message: "A network error prevented the media from loading.",
        };
      case MediaError.MEDIA_ERR_DECODE:
        return {
          code: native.code,
          message: "The media could not be decoded.",
        };
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return {
          code: native.code,
          message: "The media format is not supported.",
        };
      default:
        return {
          code: native.code,
          message: native.message || "An unknown playback error occurred.",
        };
    }
  }

  /** @internal Read state from native element into the signal. */
  private updateState(): void {
    const el = this.mediaElement();
    if (!el) return;

    let buffered = 0;
    if (el.buffered.length > 0 && el.duration > 0) {
      buffered = el.buffered.end(el.buffered.length - 1) / el.duration;
    }

    this.state.set({
      playing: !el.paused && !el.ended,
      paused: el.paused,
      ended: el.ended,
      currentTime: el.currentTime,
      duration: el.duration,
      buffered,
      volume: el.volume,
      muted: el.muted,
      playbackRate: el.playbackRate,
      error: this.state().error,
    });
  }

  /** @internal Throttle time updates to animation frames. */
  private throttledUpdateState(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.updateState();
      this.rafId = null;
    });
  }

  /**
   * Percentage of sampled pixels that must exceed the brightness
   * threshold for a frame to be considered "non-black".
   * @internal
   */
  private static readonly POSTER_BRIGHTNESS_MIN_RATIO = 0.1;

  /**
   * Per-pixel brightness threshold (0–255). A pixel whose average
   * RGB value is below this is considered "dark".
   * @internal
   */
  private static readonly POSTER_BRIGHTNESS_THRESHOLD = 30;

  /**
   * Maximum number of seek attempts before giving up and using
   * whatever frame was last captured.
   * @internal
   */
  private static readonly POSTER_MAX_ATTEMPTS = 5;

  /**
   * @internal Capture a single frame from the video element and
   * store it as a data-URL in `generatedPoster`.
   *
   * Called automatically when the video's `loadeddata` event fires
   * and no explicit `poster` input was provided.
   *
   * The method samples the frame at several candidate timestamps
   * (2 %, 5 %, 10 %, 20 %, 30 % of duration) and picks the first
   * frame that isn't mostly black. This avoids the common pitfall
   * of capturing a black leader, fade-in, or letterbox frame.
   */
  private capturePosterFrame(): void {
    this.log.info("[poster] capturePosterFrame called", [
      { type: this.type(), explicitPoster: this.poster() },
    ]);

    if (this.type() !== "video") {
      this.log.info("[poster] skipped — not video type", [this.type()]);
      return;
    }
    if (this.poster()) {
      this.log.info("[poster] skipped — explicit poster provided", [
        this.poster(),
      ]);
      return;
    }

    const video = this.videoRef()?.nativeElement;
    if (!video) {
      this.log.warn("[poster] skipped — video element ref not available");
      return;
    }
    if (video.videoWidth === 0) {
      this.log.warn("[poster] skipped — videoWidth is 0 (no decoded frame)", [
        {
          readyState: video.readyState,
          networkState: video.networkState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          src: video.currentSrc || video.src,
        },
      ]);
      return;
    }

    const duration = video.duration || 0;
    if (duration === 0) {
      this.log.warn("[poster] skipped — duration is 0", [
        { duration: video.duration, readyState: video.readyState },
      ]);
      return;
    }

    this.log.info("[poster] starting frame capture", [
      {
        duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        crossOrigin: video.crossOrigin,
        currentSrc: video.currentSrc,
      },
    ]);

    // Candidate offsets — try progressively later positions.
    const candidates = [0.02, 0.05, 0.1, 0.2, 0.3].map((f) =>
      Math.min(f * duration, duration - 0.1),
    );
    this.log.info("[poster] candidate timestamps (seconds)", [candidates]);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      this.log.warn("[poster] skipped — could not get 2d canvas context");
      return;
    }

    let attempt = 0;
    let bestDataUrl = "";

    const tryNext = (): void => {
      if (attempt >= candidates.length) {
        // Exhausted all candidates — use the last capture (or empty).
        this.log.info(
          `[poster] exhausted all ${candidates.length} candidates`,
          [{ hasFallback: !!bestDataUrl }],
        );
        if (bestDataUrl) {
          this.generatedPoster.set(bestDataUrl);
          this.log.info(
            "[poster] ✓ using best available frame as poster (all were dark)",
          );
        } else {
          this.log.warn("[poster] ✗ no usable frame captured at all");
        }
        return;
      }

      const seekTarget = candidates[attempt];
      this.log.info(
        `[poster] attempt ${attempt + 1}/${candidates.length} — seeking to ${seekTarget.toFixed(2)}s`,
      );
      attempt++;

      const onSeeked = (): void => {
        video.removeEventListener("seeked", onSeeked);
        this.log.info(
          `[poster] seeked to ${video.currentTime.toFixed(2)}s (requested ${seekTarget.toFixed(2)}s)`,
        );
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

          // Always keep the latest capture as fallback.
          bestDataUrl = dataUrl;

          const brightInfo = this.measureFrameBrightness(
            ctx,
            canvas.width,
            canvas.height,
          );
          this.log.info(
            `[poster] frame brightness: ${(brightInfo.ratio * 100).toFixed(1)}% bright pixels (${brightInfo.brightSamples}/${brightInfo.totalSamples}), threshold=${UIMediaPlayer.POSTER_BRIGHTNESS_MIN_RATIO * 100}%`,
          );

          if (brightInfo.isBright) {
            this.generatedPoster.set(dataUrl);
            this.log.info(
              `[poster] ✓ accepted frame at ${seekTarget.toFixed(2)}s (dataUrl length: ${dataUrl.length})`,
            );
            return; // Done — found a good frame.
          }

          this.log.info(
            `[poster] ✗ frame at ${seekTarget.toFixed(2)}s too dark, trying next`,
          );
          // Frame is too dark, try the next candidate.
          tryNext();
        } catch (err) {
          // Canvas taint from cross-origin videos is expected;
          // fall back to the placeholder silently.
          this.log.warn(
            "[poster] canvas capture failed (likely cross-origin taint)",
            [err],
          );
        }
      };

      video.addEventListener("seeked", onSeeked, { once: true });
      video.currentTime = seekTarget;
    };

    tryNext();
  }

  /**
   * @internal Determine whether the current canvas content is
   * "bright enough" to make a useful poster.
   *
   * Samples a grid of pixels and checks that a sufficient
   * fraction exceeds the brightness threshold. This is
   * deliberately lightweight — it samples at most ~400 pixels
   * regardless of resolution.
   */
  /**
   * @internal Measure frame brightness and return detailed stats.
   */
  private measureFrameBrightness(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): {
    totalSamples: number;
    brightSamples: number;
    ratio: number;
    isBright: boolean;
  } {
    // Sample a sparse grid (≈20×20 = 400 pixels max).
    const step = Math.max(1, Math.floor(Math.min(width, height) / 20));
    let totalSamples = 0;
    let brightSamples = 0;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data; // RGBA flat array

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        totalSamples++;
        if (avg > UIMediaPlayer.POSTER_BRIGHTNESS_THRESHOLD) {
          brightSamples++;
        }
      }
    }

    const ratio = totalSamples > 0 ? brightSamples / totalSamples : 0;
    const isBright =
      totalSamples > 0 && ratio >= UIMediaPlayer.POSTER_BRIGHTNESS_MIN_RATIO;

    return { totalSamples, brightSamples, ratio, isBright };
  }

  /** @internal Revoke any blob Object URLs. */
  private revokeBlobUrls(): void {
    for (const url of this.blobUrls) {
      URL.revokeObjectURL(url);
    }
    this.blobUrls.length = 0;
  }

  /** @internal Format seconds as `mm:ss` or `h:mm:ss`. */
  private formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }
}
