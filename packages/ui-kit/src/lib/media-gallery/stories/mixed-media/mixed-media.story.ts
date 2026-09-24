import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIImage } from "../../../image/image.component";
import { UIMediaPlayer } from "../../../media-player/media-player.component";
import type { MediaSource } from "../../../media-player/media-player.types";
import { UIMediaGallery } from "../../media-gallery.component";
import { UIMediaGalleryItem } from "../../media-gallery.directive";
import { MEDIA_GALLERY_DEFAULT_IDLE_DELAY } from "../../media-gallery.tokens";
import type { MediaGalleryItem } from "../../media-gallery.types";

@Component({
    selector: "ui-media-gallery-mixed-media-story",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UIImage, UIMediaPlayer, UIMediaGallery, UIMediaGalleryItem],
    templateUrl: "./mixed-media.story.html",
    styleUrl: "./mixed-media.story.scss",
})
export class MixedMediaStorySource {
    public readonly idleDelay = input(MEDIA_GALLERY_DEFAULT_IDLE_DELAY);
    public readonly showFilmstrip = input(true);
    public readonly galleryImages = Array.from({ length: 10 }, (_, index) => ({
        src: `https://picsum.photos/seed/media-gallery-${index + 1}/960/640`,
        alt: `Gallery landscape ${index + 1}`,
    }));

    public readonly separateImages = Array.from({ length: 3 }, (_, index) => ({
        src: `https://picsum.photos/seed/separate-gallery-${index + 1}/720/480`,
        alt: `Separate collection image ${index + 1}`,
    }));

    public readonly videoSource: MediaSource = {
        url: "/media/sample.mp4",
        type: "video/mp4",
    };

    public readonly inlineItems: readonly MediaGalleryItem[] = [
        {
            id: "inline-image",
            collection: "inline",
            kind: "image",
            src: "/media/sample-poster.jpg",
            alt: "Inline gallery image",
        },
        {
            id: "inline-landscape",
            collection: "inline",
            kind: "image",
            src: "https://picsum.photos/seed/inline-gallery-2/960/640",
            alt: "Inline gallery landscape",
        },
        {
            id: "inline-video",
            collection: "inline",
            kind: "video",
            src: "/media/sample.mp4",
            poster: "/media/sample-poster.jpg",
            type: "video/mp4",
            alt: "Inline gallery video",
        },
        {
            id: "inline-detail",
            collection: "inline",
            kind: "image",
            src: "https://picsum.photos/seed/inline-gallery-3/960/640",
            alt: "Inline gallery detail",
        },
    ];
}
