import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-icon-only-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./icon-only.story.html",
  styleUrl: "./icon-only.story.scss",
})
export class IconOnlyStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tabs/tab-group.stories.ts.
}
