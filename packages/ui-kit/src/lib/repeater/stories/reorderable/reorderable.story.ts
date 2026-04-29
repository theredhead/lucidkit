import { UIRepeater } from "../../repeater.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-reorderable-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRepeater],
  templateUrl: "./reorderable.story.html",
  styleUrl: "./reorderable.story.scss",
})
export class ReorderableStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/repeater/repeater.stories.ts.
}
