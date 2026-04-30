import { UITabGroup } from "../../tab-group.component";
import { UITab } from "../../tab.component";
import { UITabSeparator } from "../../tab-separator.component";
import { UITabSpacer } from "../../tab-spacer.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-panel-styles-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITabGroup, UITab, UITabSeparator, UITabSpacer],
  templateUrl: "./panel-styles.story.html",
  styleUrl: "./panel-styles.story.scss",
})
export class PanelStylesStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tabs/tab-group.stories.ts.
}
