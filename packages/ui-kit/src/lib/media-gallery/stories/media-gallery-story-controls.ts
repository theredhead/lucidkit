import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../media-gallery.tokens";

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
} as const;

/** Shared Storybook args with the library's built-in idle-delay default. */
export function mediaGalleryStoryArgs(showFilmstrip: boolean): {
    readonly idleDelay: number;
    readonly showFilmstrip: boolean;
} {
    return {
        idleDelay: MEDIA_GALLERY_DEFAULT_IDLE_DELAY,
        showFilmstrip,
    };
}
