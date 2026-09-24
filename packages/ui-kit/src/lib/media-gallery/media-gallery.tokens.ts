import { InjectionToken } from "@angular/core";

/** Placement of the fullscreen gallery close button. */
export type MediaGalleryClosePosition = "left" | "right";

/** Built-in pointer inactivity delay in milliseconds. */
export const MEDIA_GALLERY_DEFAULT_IDLE_DELAY = 3000;

/** Injectable default placement for the fullscreen gallery close button. */
export const MEDIA_GALLERY_CLOSE_POSITION = new InjectionToken<MediaGalleryClosePosition>(
    "MEDIA_GALLERY_CLOSE_POSITION",
    {
        providedIn: "root",
        factory: () => "right",
    },
);

/** Injectable default pointer inactivity delay in milliseconds. */
export const MEDIA_GALLERY_IDLE_DELAY = new InjectionToken<number>(
    "MEDIA_GALLERY_IDLE_DELAY",
    {
        providedIn: "root",
        factory: () => MEDIA_GALLERY_DEFAULT_IDLE_DELAY,
    },
);
