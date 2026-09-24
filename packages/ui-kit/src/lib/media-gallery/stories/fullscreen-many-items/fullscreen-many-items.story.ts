import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIImage } from "../../../image/image.component";
import { UIMediaGallery } from "../../media-gallery.component";
import { UIMediaGalleryItem } from "../../media-gallery.directive";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import { createStoryImages } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-fullscreen-many-items-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIImage, UIMediaGallery, UIMediaGalleryItem],
    templateUrl: "./fullscreen-many-items.story.html",
    styleUrl: "./fullscreen-many-items.story.scss",
})
export class FullscreenManyItemsStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(true);
    public readonly images = createStoryImages("gallery-many", 30);
}
