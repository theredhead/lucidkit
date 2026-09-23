import { InjectionToken } from "@angular/core";

/** Placement of the fullscreen gallery close button. */
export type MediaGalleryClosePosition = "left" | "right";

/** Injectable default placement for the fullscreen gallery close button. */
export const MEDIA_GALLERY_CLOSE_POSITION = new InjectionToken<MediaGalleryClosePosition>(
  "MEDIA_GALLERY_CLOSE_POSITION",
  {
    providedIn: "root",
    factory: () => "right",
  },
);
