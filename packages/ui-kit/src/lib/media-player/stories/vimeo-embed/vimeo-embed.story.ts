import { UIMediaPlayer } from "../../media-player.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vimeo-embed-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./vimeo-embed.story.html",
  styleUrl: "./vimeo-embed.story.scss",
})
export class VimeoEmbedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/media-player/media-player.stories.ts.
}
