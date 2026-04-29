import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-multiline-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./multiline.story.html",
  styleUrl: "./multiline.story.scss",
})
export class MultilineStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/input/input.stories.ts.
}
