import { UITooltip } from "../../tooltip.directive";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITooltip, UIButton],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tooltip/tooltip.stories.ts.
}
