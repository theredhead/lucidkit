import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../media-gallery.tokens";
import type { MediaGalleryTransition } from "../media-gallery.types";

/** Shared Storybook controls for media-gallery scenarios. */
export const mediaGalleryStoryArgTypes = {
    idleDelay: {
        control: { type: "number", min: 0, step: 250 },
        description:
            "Milliseconds of pointer inactivity before controls and cursor hide.",
    },
    showFilmstrip: {
        control: "boolean",
        description: "Whether the media preview filmstrip is rendered.",
    },
    transition: {
        control: "select",
        options: ["none", "fade", "slide", "zoom"] satisfies MediaGalleryTransition[],
        description: "Animation used when the active media item changes.",
    },
} as const;

/** Shared Storybook args with the library's built-in idle-delay default. */
export function mediaGalleryStoryArgs(showFilmstrip: boolean): {
    readonly idleDelay: number;
    readonly showFilmstrip: boolean;
    readonly transition: MediaGalleryTransition;
} {
    return {
        idleDelay: MEDIA_GALLERY_DEFAULT_IDLE_DELAY,
        showFilmstrip,
        transition: "none",
    };
}
