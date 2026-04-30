import { UISplitContainer } from "../../split-container.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-double-click-collapse-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer],
  templateUrl: "./double-click-collapse.story.html",
  styleUrl: "./double-click-collapse.story.scss",
})
export class DoubleClickCollapseStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/split-container/split-container.stories.ts.
}
