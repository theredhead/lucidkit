import { UIMediaPlayer } from "../../media-player.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-programmatic-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./programmatic.story.html",
  styleUrl: "./programmatic.story.scss",
})
export class ProgrammaticStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/media-player/media-player.stories.ts.
}
