import { UISplitContainer } from "../../split-container.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vertical-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer],
  templateUrl: "./vertical.story.html",
  styleUrl: "./vertical.story.scss",
})
export class VerticalStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/split-container/split-container.stories.ts.
}
