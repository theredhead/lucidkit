import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIMediaGallery } from "../../media-gallery.component";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import type { MediaGalleryTransition } from "../../media-gallery.types";
import { createInlineStoryItems } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-inline-without-filmstrip-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIMediaGallery],
    templateUrl: "./inline-without-filmstrip.story.html",
    styleUrl: "./inline-without-filmstrip.story.scss",
})
export class InlineWithoutFilmstripStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(false);
    public readonly transition = input<MediaGalleryTransition>("none");
    public readonly items = createInlineStoryItems("inline-no-strip", 6);
}
