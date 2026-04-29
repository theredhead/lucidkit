import { UIToastContainer } from "../../toast.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-positions-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToastContainer],
  templateUrl: "./positions.story.html",
  styleUrl: "./positions.story.scss",
})
export class PositionsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toast/toast.stories.ts.
}
