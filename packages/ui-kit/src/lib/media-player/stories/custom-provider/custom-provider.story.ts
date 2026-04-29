import { UIMediaPlayer } from "../../media-player.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-provider-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIMediaPlayer],
  templateUrl: "./custom-provider.story.html",
  styleUrl: "./custom-provider.story.scss",
})
export class CustomProviderStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/media-player/media-player.stories.ts.
}
