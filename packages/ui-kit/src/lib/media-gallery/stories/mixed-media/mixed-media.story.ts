import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIImage } from "../../../image/image.component";
import { UIMediaPlayer } from "../../../media-player/media-player.component";
import type { MediaSource } from "../../../media-player/media-player.types";
import { UIMediaGallery } from "../../media-gallery.component";
import { UIMediaGalleryItem } from "../../media-gallery.directive";
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
      id: "inline-video",
      collection: "inline",
      kind: "video",
      src: "/media/sample.mp4",
      poster: "/media/sample-poster.jpg",
      type: "video/mp4",
      alt: "Inline gallery video",
    },
  ];
}
