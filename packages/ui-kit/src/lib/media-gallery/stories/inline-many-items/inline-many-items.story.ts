import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIMediaGallery } from "../../media-gallery.component";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import type { MediaGalleryTransition } from "../../media-gallery.types";
import { createInlineStoryItems } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-inline-many-items-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIMediaGallery],
    templateUrl: "./inline-many-items.story.html",
    styleUrl: "./inline-many-items.story.scss",
})
export class InlineManyItemsStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(true);
    public readonly transition = input<MediaGalleryTransition>("none");
    public readonly items = createInlineStoryItems("inline-many", 30);
}
