import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type { MediaSource, MediaTrack } from "../../media-player.types";

@Component({
  selector: "ui-with-tracks-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./with-tracks.story.html",
  styleUrl: "./with-tracks.story.scss",
})
export class WithTracksStorySource {
  public readonly videoSource: MediaSource = {
    url: "/media/sample.mp4",
    type: "video/mp4",
  };

  public readonly subtitles: readonly MediaTrack[] = [
    {
      kind: "subtitles",
      src: "/media/sample.vtt",
      srcLang: "en",
      label: "English",
      default: true,
    },
  ];
}
