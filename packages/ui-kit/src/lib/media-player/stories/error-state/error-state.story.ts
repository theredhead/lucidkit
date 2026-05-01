import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-error-state-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./error-state.story.html",
  styleUrl: "./error-state.story.scss",
})
export class ErrorStateStorySource {
  public readonly brokenSource: MediaSource = {
    url: "/media/this-does-not-exist.mp4",
    type: "video/mp4",
  };
}
