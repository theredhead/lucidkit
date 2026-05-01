import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type {
  MediaCrossOrigin,
  MediaFit,
  MediaPlayerEvent,
  MediaPreload,
  MediaSource,
  MediaTrack,
  MediaType,
} from "../../media-player.types";

const SAMPLE_VIDEO: MediaSource = {
  url: "/media/sample.mp4",
  type: "video/mp4",
};

const SAMPLE_POSTER = "/media/sample-poster.jpg";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input("Sample video");

  public readonly autoplay = input(false);

  public readonly controls = input(true);

  public readonly crossOrigin = input<MediaCrossOrigin | null>("anonymous");

  public readonly fit = input<MediaFit>("contain");

  public readonly loop = input(false);

  public readonly mediaEnded = output<MediaPlayerEvent>();

  public readonly mediaError = output<MediaPlayerEvent>();

  public readonly mediaLoadedMetadata = output<MediaPlayerEvent>();

  public readonly mediaPause = output<MediaPlayerEvent>();

  public readonly mediaPlay = output<MediaPlayerEvent>();

  public readonly mediaTimeUpdate = output<MediaPlayerEvent>();

  public readonly muted = input(false);

  public readonly playbackRates = input<readonly number[]>([
    0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2,
  ]);

  public readonly poster = input(SAMPLE_POSTER);

  public readonly preload = input<MediaPreload>("metadata");

  public readonly source = input<MediaSource | null>(SAMPLE_VIDEO);

  public readonly sources = input<readonly MediaSource[]>([]);

  public readonly tracks = input<readonly MediaTrack[]>([]);

  public readonly type = input<MediaType>("video");

  public readonly volume = input(1);
}
