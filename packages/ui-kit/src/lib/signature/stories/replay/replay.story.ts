import { UISignature } from "../../signature.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-replay-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./replay.story.html",
  styleUrl: "./replay.story.scss",
})
export class ReplayStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.
}
