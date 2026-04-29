import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-colors-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./all-colors.story.html",
  styleUrl: "./all-colors.story.scss",
})
export class AllColorsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/button/button.stories.ts.
}
