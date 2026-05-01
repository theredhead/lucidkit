import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import {
  provideMediaEmbedProviders,
  youTubeEmbedProvider,
} from "../../media-player.providers";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-you-tube-embed-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  providers: [...provideMediaEmbedProviders(youTubeEmbedProvider)],
  templateUrl: "./you-tube-embed.story.html",
  styleUrl: "./you-tube-embed.story.scss",
})
export class YouTubeEmbedStorySource {
  public readonly videoSource: MediaSource = {
    // Big Buck Bunny trailer — Creative Commons licensed
    url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
  };
}
