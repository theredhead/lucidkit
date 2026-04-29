import { UIMediaPlayer } from "../../media-player.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-error-state-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./error-state.story.html",
  styleUrl: "./error-state.story.scss",
})
export class ErrorStateStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/media-player/media-player.stories.ts.
}
