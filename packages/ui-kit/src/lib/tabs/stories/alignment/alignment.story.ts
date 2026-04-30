import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-alignment-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./alignment.story.html",
  styleUrl: "./alignment.story.scss",
})
export class AlignmentStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tabs/tab-group.stories.ts.
}
