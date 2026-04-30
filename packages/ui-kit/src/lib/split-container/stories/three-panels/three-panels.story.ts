import { UISplitContainer } from "../../split-container.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-three-panels-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer],
  templateUrl: "./three-panels.story.html",
  styleUrl: "./three-panels.story.scss",
})
export class ThreePanelsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/split-container/split-container.stories.ts.
}
