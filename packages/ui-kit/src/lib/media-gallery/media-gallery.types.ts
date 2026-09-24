/** The media kinds supported by the gallery viewer. */
export type MediaGalleryKind = "image" | "video";

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
}
