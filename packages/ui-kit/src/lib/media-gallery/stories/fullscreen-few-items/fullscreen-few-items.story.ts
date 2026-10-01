import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIImage } from "../../../image/image.component";
import { UIMediaPlayer } from "../../../media-player/media-player.component";
import type { MediaSource } from "../../../media-player/media-player.types";
import { UIMediaGallery } from "../../media-gallery.component";
import { UIMediaGalleryItem } from "../../media-gallery.directive";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import type { MediaGalleryTransition } from "../../media-gallery.types";
import { createStoryImages } from "../media-gallery-story-data";

@Component({
    selector: "ui-media-gallery-fullscreen-few-items-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIImage, UIMediaPlayer, UIMediaGallery, UIMediaGalleryItem],
    templateUrl: "./fullscreen-few-items.story.html",
    styleUrl: "./fullscreen-few-items.story.scss",
})
export class FullscreenFewItemsStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(true);
    public readonly transition = input<MediaGalleryTransition>("none");
    public readonly images = createStoryImages("gallery-few", 3);
    public readonly videoSource: MediaSource = {
        url: "/media/sample.mp4",
        type: "video/mp4",
    };
}
