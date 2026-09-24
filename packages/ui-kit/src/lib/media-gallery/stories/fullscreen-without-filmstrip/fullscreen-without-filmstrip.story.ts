import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIImage } from "../../../image/image.component";
import { UIMediaGallery } from "../../media-gallery.component";
import { UIMediaGalleryItem } from "../../media-gallery.directive";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import { createStoryImages } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-fullscreen-without-filmstrip-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIImage, UIMediaGallery, UIMediaGalleryItem],
    templateUrl: "./fullscreen-without-filmstrip.story.html",
    styleUrl: "./fullscreen-without-filmstrip.story.scss",
})
export class FullscreenWithoutFilmstripStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(false);
    public readonly images = createStoryImages("gallery-no-strip", 6);
}
