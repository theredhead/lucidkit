import { UIIcon } from "../../icon.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-sizes-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./sizes.story.html",
  styleUrl: "./sizes.story.scss",
})
export class SizesStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/icon/icon.stories.ts.

  public s = undefined as never;
  public svg = undefined as never;
}
