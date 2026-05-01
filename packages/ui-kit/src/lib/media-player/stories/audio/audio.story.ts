import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-audio-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./audio.story.html",
  styleUrl: "./audio.story.scss",
})
export class AudioStorySource {
  public readonly audioSource: MediaSource = {
    url: "/media/sample.m4a",
    type: "audio/mp4",
  };
}
