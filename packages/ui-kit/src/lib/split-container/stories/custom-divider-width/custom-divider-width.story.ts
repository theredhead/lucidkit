import { UISplitContainer } from "../../split-container.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-divider-width-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer],
  templateUrl: "./custom-divider-width.story.html",
  styleUrl: "./custom-divider-width.story.scss",
})
export class CustomDividerWidthStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/split-container/split-container.stories.ts.
}
