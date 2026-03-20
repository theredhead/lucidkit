import { InjectionToken, type Provider } from "@angular/core";

import type {
  MediaEmbedConfig,
  MediaEmbedProvider,
} from "./media-player.types";

/**
 * DI token used to register {@link MediaEmbedProvider} instances.
 *
 * Supports `multi: true` so that multiple providers can be
 * registered independently. The media player iterates through
 * all registered providers (in order) and uses the first one
 * that returns a non-`null` {@link MediaEmbedConfig}.
 *
 * @example
 * ```ts
 * // Register the built-in providers in your app config:
 * provideMediaEmbedProviders(youTubeEmbedProvider, vimeoEmbedProvider)
 *
 * // Or add your own alongside the built-ins:
 * provideMediaEmbedProviders(
 *   youTubeEmbedProvider,
 *   vimeoEmbedProvider,
 *   new MyCustomProvider(),
 * )
 * ```
 */
export const MEDIA_EMBED_PROVIDERS = new InjectionToken<MediaEmbedProvider[]>(
  "MEDIA_EMBED_PROVIDERS",
);

/**
 * Convenience function to register one or more
 * {@link MediaEmbedProvider} instances via Angular DI.
 *
 * Each provider is registered as a separate `multi` entry so that
 * consumers can call this function multiple times (e.g. in lazy
 * routes) without clobbering previous registrations.
 *
 * @example
 * ```ts
 * // app.config.ts
 * import {
 *   provideMediaEmbedProviders,
 *   youTubeEmbedProvider,
 *   vimeoEmbedProvider,
 * } from '@theredhead/ui-kit';
 *
 * export const appConfig = {
 *   providers: [
 *     provideMediaEmbedProviders(youTubeEmbedProvider, vimeoEmbedProvider),
 *   ],
 * };
 * ```
 */
export function provideMediaEmbedProviders(
  ...providers: MediaEmbedProvider[]
): Provider[] {
  return providers.map((provider) => ({
    provide: MEDIA_EMBED_PROVIDERS,
    useValue: provider,
    multi: true,
  }));
}

// ── Built-in providers ────────────────────────────────────────────────

/**
 * Built-in {@link MediaEmbedProvider} for **YouTube**.
 *
 * Recognises the following URL patterns:
 * - `https://www.youtube.com/watch?v=VIDEO_ID`
 * - `https://youtube.com/watch?v=VIDEO_ID`
 * - `https://youtu.be/VIDEO_ID`
 * - `https://www.youtube.com/embed/VIDEO_ID`
 * - `https://youtube.com/shorts/VIDEO_ID`
 * - `https://www.youtube.com/live/VIDEO_ID`
 *
 * @example
 * ```ts
 * provideMediaEmbedProviders(youTubeEmbedProvider)
 * ```
 */
export const youTubeEmbedProvider: MediaEmbedProvider = {
  name: "YouTube",

  resolve(url: string): MediaEmbedConfig | null {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;

    return {
      iframeSrc: `https://www.youtube.com/embed/${videoId}`,
      providerName: "YouTube",
      aspectRatio: "16 / 9",
    };
  },
};

/**
 * Built-in {@link MediaEmbedProvider} for **Vimeo**.
 *
 * Recognises the following URL patterns:
 * - `https://vimeo.com/VIDEO_ID`
 * - `https://www.vimeo.com/VIDEO_ID`
 * - `https://player.vimeo.com/video/VIDEO_ID`
 *
 * @example
 * ```ts
 * provideMediaEmbedProviders(vimeoEmbedProvider)
 * ```
 */
export const vimeoEmbedProvider: MediaEmbedProvider = {
  name: "Vimeo",

  resolve(url: string): MediaEmbedConfig | null {
    const videoId = extractVimeoId(url);
    if (!videoId) return null;

    return {
      iframeSrc: `https://player.vimeo.com/video/${videoId}`,
      providerName: "Vimeo",
      aspectRatio: "16 / 9",
    };
  },
};

/**
 * Built-in {@link MediaEmbedProvider} for **Dailymotion**.
 *
 * Recognises the following URL patterns:
 * - `https://www.dailymotion.com/video/VIDEO_ID`
 * - `https://dailymotion.com/video/VIDEO_ID`
 * - `https://dai.ly/VIDEO_ID`
 *
 * @example
 * ```ts
 * provideMediaEmbedProviders(dailymotionEmbedProvider)
 * ```
 */
export const dailymotionEmbedProvider: MediaEmbedProvider = {
  name: "Dailymotion",

  resolve(url: string): MediaEmbedConfig | null {
    const videoId = extractDailymotionId(url);
    if (!videoId) return null;

    return {
      iframeSrc: `https://www.dailymotion.com/embed/video/${videoId}`,
      providerName: "Dailymotion",
      aspectRatio: "16 / 9",
    };
  },
};

// ── URL parsing helpers ───────────────────────────────────────────────

/** @internal Extract a YouTube video ID from a URL string. */
function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    // youtu.be/VIDEO_ID
    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split(/[/?]/)[0] || null;
    }

    if (host !== "youtube.com") return null;

    // /watch?v=VIDEO_ID
    const v = parsed.searchParams.get("v");
    if (v) return v;

    // /embed/VIDEO_ID, /shorts/VIDEO_ID, /live/VIDEO_ID
    const segmentMatch = parsed.pathname.match(
      /^\/(embed|shorts|live)\/([^/?]+)/,
    );
    if (segmentMatch) return segmentMatch[2];

    return null;
  } catch {
    return null;
  }
}

/** @internal Extract a Vimeo video ID from a URL string. */
function extractVimeoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    // player.vimeo.com/video/VIDEO_ID
    if (host === "player.vimeo.com") {
      const match = parsed.pathname.match(/^\/video\/(\d+)/);
      return match ? match[1] : null;
    }

    // vimeo.com/VIDEO_ID
    if (host === "vimeo.com") {
      const match = parsed.pathname.match(/^\/(\d+)/);
      return match ? match[1] : null;
    }

    return null;
  } catch {
    return null;
  }
}

/** @internal Extract a Dailymotion video ID from a URL string. */
function extractDailymotionId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    // dai.ly/VIDEO_ID
    if (host === "dai.ly") {
      return parsed.pathname.slice(1).split(/[/?]/)[0] || null;
    }

    // dailymotion.com/video/VIDEO_ID
    if (host === "dailymotion.com") {
      const match = parsed.pathname.match(/^\/video\/([^/?]+)/);
      return match ? match[1] : null;
    }

    return null;
  } catch {
    return null;
  }
}
