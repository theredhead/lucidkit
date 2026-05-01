import { UIMediaPlayer } from "../../media-player.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-you-tube-embed-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./you-tube-embed.story.html",
  styleUrl: "./you-tube-embed.story.scss",
})
export class YouTubeEmbedStorySource {
}
