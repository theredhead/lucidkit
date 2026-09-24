import type { MediaGalleryItem } from "../media-gallery.types";

/** Image fixture used by fullscreen media-gallery stories. */
export interface MediaGalleryStoryImage {
    /** Image source URL. */
    readonly src: string;

    /** Accessible image description. */
    readonly alt: string;
}

/** Create deterministic image fixtures for a fullscreen gallery collection. */
export function createStoryImages(
    seed: string,
    count: number,
): readonly MediaGalleryStoryImage[] {
    return Array.from({ length: count }, (_, index) => ({
        src: `https://picsum.photos/seed/${seed}-${index + 1}/960/640`,
        alt: `Gallery image ${index + 1}`,
    }));
}

/** Create deterministic image items for a constrained inline gallery. */
export function createInlineStoryItems(
    seed: string,
    count: number,
): readonly MediaGalleryItem[] {
    return createStoryImages(seed, count).map((image, index) => ({
        id: `${seed}-${index + 1}`,
        collection: seed,
        kind: "image" as const,
        src: image.src,
        alt: image.alt,
    }));
}
