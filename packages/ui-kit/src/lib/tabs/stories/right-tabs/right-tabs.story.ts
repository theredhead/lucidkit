import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-right-tabs-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./right-tabs.story.html",
  styleUrl: "./right-tabs.story.scss",
})
export class RightTabsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tabs/tab-group.stories.ts.
}
