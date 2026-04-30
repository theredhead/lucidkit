import { UISplitContainer } from "../../split-container.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-persistent-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISplitContainer],
  templateUrl: "./persistent.story.html",
  styleUrl: "./persistent.story.scss",
})
export class PersistentStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/split-container/split-container.stories.ts.
}
