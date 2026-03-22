/**
 * The type of media being played.
 *
 * - `'audio'` — audio-only playback (shows waveform / minimal UI)
 * - `'video'` — full video playback with visual viewport
 */
export type MediaType = "audio" | "video";

/**
 * CORS setting for the media element.
 *
 * Maps to the `crossorigin` attribute on `<video>` / `<audio>`.
 *
 * - `'anonymous'`       — send a CORS request without credentials
 * - `'use-credentials'` — send a CORS request with credentials
 *
 * Setting this to `'anonymous'` (the default) is required for the
 * automatic poster-frame capture to work on cross-origin videos,
 * because the canvas becomes "tainted" otherwise.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 */
export type MediaCrossOrigin = "anonymous" | "use-credentials";

/**
 * Describes how the video should be fitted within its viewport.
 *
 * Maps directly to the CSS `object-fit` property on the
 * underlying `<video>` element.
 */
export type MediaFit = "contain" | "cover" | "fill" | "none" | "scale-down";

/**
 * Preload hint passed to the underlying `<audio>` / `<video>` element.
 *
 * - `'none'`     — do not preload any data
 * - `'metadata'` — preload only metadata (duration, dimensions, etc.)
 * - `'auto'`     — let the browser decide how much to buffer
 */
export type MediaPreload = "none" | "metadata" | "auto";

/**
 * A single media source.
 *
 * Supply **either** a `url` (for network resources) or a `blob`
 * (for in-memory binary data). When both are provided, `blob`
 * takes precedence.
 *
 * @example
 * ```ts
 * // From URL
 * const urlSource: MediaSource = {
 *   url: 'https://example.com/video.mp4',
 *   type: 'video/mp4',
 * };
 *
 * // From Blob
 * const blobSource: MediaSource = {
 *   blob: myVideoBlob,
 *   type: 'video/webm',
 * };
 * ```
 */
export interface MediaSource {
  /** Network URL of the media resource. */
  readonly url?: string;

  /** In-memory binary data (e.g. from a fetch response or file input). */
  readonly blob?: Blob;

  /**
   * MIME type of the source (e.g. `'video/mp4'`, `'audio/ogg'`).
   *
   * When omitted the browser will attempt to determine the type
   * from the resource headers or file extension.
   */
  readonly type?: string;
}

/**
 * The kind of a {@link MediaTrack}.
 *
 * Maps to the `kind` attribute of the HTML `<track>` element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track#kind
 */
export type MediaTrackKind =
  | "subtitles"
  | "captions"
  | "descriptions"
  | "chapters"
  | "metadata";

/**
 * A text track (subtitles, captions, chapters, etc.) associated
 * with a media source.
 *
 * Maps to the HTML `<track>` element attributes.
 *
 * @example
 * ```ts
 * const track: MediaTrack = {
 *   kind: 'subtitles',
 *   src: '/subs/en.vtt',
 *   srcLang: 'en',
 *   label: 'English',
 *   default: true,
 * };
 * ```
 */
export interface MediaTrack {
  /** The kind of text track. */
  readonly kind: MediaTrackKind;

  /** URL of the track file (typically WebVTT `.vtt`). */
  readonly src: string;

  /** BCP 47 language tag (e.g. `'en'`, `'fr'`). */
  readonly srcLang?: string;

  /** Human-readable label shown in track selection UI. */
  readonly label?: string;

  /** Whether this track should be active by default. */
  readonly default?: boolean;
}

/**
 * Playback state exposed by the media player.
 *
 * All time values are in **seconds**.
 */
export interface MediaPlayerState {
  /** Whether media is currently playing. */
  readonly playing: boolean;

  /** Whether media has been paused. */
  readonly paused: boolean;

  /** Whether playback has ended. */
  readonly ended: boolean;

  /** Current playback position in seconds. */
  readonly currentTime: number;

  /** Total duration in seconds (`NaN` until metadata is loaded). */
  readonly duration: number;

  /** Buffered fraction `0..1`. */
  readonly buffered: number;

  /** Current volume `0..1`. */
  readonly volume: number;

  /** Whether audio is muted. */
  readonly muted: boolean;

  /** Current playback rate (e.g. `1` = normal, `2` = double speed). */
  readonly playbackRate: number;

  /**
   * The current media error, or `null` when playback is healthy.
   *
   * Populated from the native `MediaError` when the browser
   * fails to load or decode the resource (e.g. 404, 429, codec
   * not supported).
   */
  readonly error: MediaErrorInfo | null;
}

/**
 * Structured information about a media playback error.
 */
export interface MediaErrorInfo {
  /** The `MediaError.code` value from the native element. */
  readonly code: number;

  /** Human-readable description of the error. */
  readonly message: string;
}

/**
 * Events emitted by the media player component.
 */
export interface MediaPlayerEvent {
  /** Source element reference for advanced consumers. */
  readonly nativeElement: HTMLMediaElement;
}

// ── Embed provider API ────────────────────────────────────────────────

/**
 * Configuration produced by a {@link MediaEmbedProvider} when it
 * recognises a URL as embeddable.
 *
 * The component renders this as a sandboxed `<iframe>` instead
 * of a native `<video>` / `<audio>` element.
 *
 * @example
 * ```ts
 * const config: MediaEmbedConfig = {
 *   iframeSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
 *   providerName: 'YouTube',
 *   allow: 'autoplay; encrypted-media; picture-in-picture',
 *   aspectRatio: '16 / 9',
 * };
 * ```
 */
export interface MediaEmbedConfig {
  /**
   * The full `src` URL for the embed `<iframe>`.
   *
   * Must be an HTTPS URL pointing to the provider's embed endpoint.
   */
  readonly iframeSrc: string;

  /** Human-readable name of the provider (e.g. `'YouTube'`). */
  readonly providerName: string;

  /**
   * CSS `aspect-ratio` value for the embed viewport.
   *
   * @default '16 / 9'
   */
  readonly aspectRatio?: string;
}

/**
 * Strategy interface for resolving a media URL into an embeddable
 * iframe configuration.
 *
 * Library consumers implement this interface to add support for
 * additional video/audio hosting services. Built-in implementations
 * are provided for YouTube, Vimeo, and Dailymotion.
 *
 * @example
 * ```ts
 * // Custom provider for a fictional service
 * export class MyVideoProvider implements MediaEmbedProvider {
 *   readonly name = 'MyVideo';
 *
 *   resolve(url: string): MediaEmbedConfig | null {
 *     const match = url.match(/myvideo\.com\/watch\/(\w+)/);
 *     if (!match) return null;
 *     return {
 *       iframeSrc: \`https://myvideo.com/embed/\${match[1]}\`,
 *       providerName: this.name,
 *     };
 *   }
 * }
 * ```
 */
export interface MediaEmbedProvider {
  /** Human-readable name shown in diagnostics. */
  readonly name: string;

  /**
   * Attempt to resolve a URL into an embed configuration.
   *
   * @returns The embed config if the URL matches this provider,
   *          or `null` to pass through to the next provider /
   *          native playback.
   */
  resolve(url: string): MediaEmbedConfig | null;
}
