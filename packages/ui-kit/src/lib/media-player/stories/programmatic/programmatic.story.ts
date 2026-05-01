import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-programmatic-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./programmatic.story.html",
  styleUrl: "./programmatic.story.scss",
})
export class ProgrammaticStorySource {
  public readonly videoSource: MediaSource = {
    url: "/media/sample.mp4",
    type: "video/mp4",
  };
}
