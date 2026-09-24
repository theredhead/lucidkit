import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIMediaGallery } from "../../media-gallery.component";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import { createInlineStoryItems } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-inline-few-items-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIMediaGallery],
    templateUrl: "./inline-few-items.story.html",
    styleUrl: "./inline-few-items.story.scss",
})
export class InlineFewItemsStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(true);
    public readonly items = createInlineStoryItems("inline-few", 4);
}
