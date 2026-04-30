import { UISignature } from "../../signature.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-modes-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISignature],
  templateUrl: "./all-modes.story.html",
  styleUrl: "./all-modes.story.scss",
})
export class AllModesStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/signature/signature.stories.ts.
}
