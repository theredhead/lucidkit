import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-sizes-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./all-sizes.story.html",
  styleUrl: "./all-sizes.story.scss",
})
export class AllSizesStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/button/button.stories.ts.
}
