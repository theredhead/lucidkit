import { UIRepeater } from "../../repeater.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-transfer-between-lists-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRepeater],
  templateUrl: "./transfer-between-lists.story.html",
  styleUrl: "./transfer-between-lists.story.scss",
})
export class TransferBetweenListsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/repeater/repeater.stories.ts.
}
