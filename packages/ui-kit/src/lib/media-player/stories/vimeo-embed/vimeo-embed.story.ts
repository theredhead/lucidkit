import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UIMediaPlayer } from "../../media-player.component";
import {
  provideMediaEmbedProviders,
  vimeoEmbedProvider,
} from "../../media-player.providers";
import type { MediaSource } from "../../media-player.types";

@Component({
  selector: "ui-vimeo-embed-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  providers: [...provideMediaEmbedProviders(vimeoEmbedProvider)],
  templateUrl: "./vimeo-embed.story.html",
  styleUrl: "./vimeo-embed.story.scss",
})
export class VimeoEmbedStorySource {
  public readonly videoSource: MediaSource = {
    url: "https://vimeo.com/76979871",
  };
}
