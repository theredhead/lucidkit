import type { MediaTrack } from "../media-player/media-player.types";

/** The media kinds supported by the gallery viewer. */
export type MediaGalleryKind = "image" | "video";

/** Animation used when the active gallery item changes. */
export type MediaGalleryTransition = "none" | "fade" | "slide" | "zoom";

/** A registered image or video item in a gallery collection. */
export interface MediaGalleryItem {
    /** Stable identity for the registered host component. */
    readonly id: string;

    /** Collection name; an empty string is the shared unnamed collection. */
    readonly collection: string;

    /** Viewer media kind. */
    readonly kind: MediaGalleryKind;

    /** Media resource URL. */
    readonly src: string;

    /** Accessible description of the media. */
    readonly alt?: string;

    /** Poster image URL for video previews and playback. */
    readonly poster?: string;

    /** MIME type of the media resource. */
    readonly type?: string;

    /**
     * Captions, subtitles, and other text tracks retained during gallery playback.
     */
    readonly tracks?: readonly MediaTrack[];
}
