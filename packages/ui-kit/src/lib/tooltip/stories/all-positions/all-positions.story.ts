import { UITooltip } from "../../tooltip.directive";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-positions-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITooltip, UIButton],
  templateUrl: "./all-positions.story.html",
  styleUrl: "./all-positions.story.scss",
})
export class AllPositionsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tooltip/tooltip.stories.ts.
}
