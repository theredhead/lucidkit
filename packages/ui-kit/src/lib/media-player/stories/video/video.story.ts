import { Component, ChangeDetectionStrategy, signal } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import { UIButton } from "../../../button/button.component";
import {
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
  vimeoEmbedProvider,
  dailymotionEmbedProvider,
} from "../../media-player.providers";
import type {
  MediaSource,
  MediaTrack,
  MediaEmbedConfig,
  MediaEmbedProvider,
} from "../../media-player.types";

// Local sample media served from public/media/ via Storybook's staticDirs.
// Avoids external dependencies and 429 rate-limiting on repeated reloads.
const SAMPLE_VIDEO: MediaSource = {
  url: "/media/sample.mp4",
  type: "video/mp4",
};

const SAMPLE_POSTER = "/media/sample-poster.jpg";

@Component({
  selector: "ui-media-player-video-demo",
  standalone: true,
  imports: [UIMediaPlayer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./video.story.html",
})
export class MediaPlayerVideoDemo {
  public readonly source: MediaSource = SAMPLE_VIDEO;
  public readonly poster = SAMPLE_POSTER;
}
