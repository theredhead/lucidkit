import { ChangeDetectionStrategy, Component } from "@angular/core";

import { UITabGroup } from "./tab-group.component";
import type { TabPosition } from "./tab-group.component";
import type { TabPanelStyle } from "./tab-group.component";
import { UITab } from "./tab.component";
import { UITabSeparator } from "./tab-separator.component";
import { UITabSpacer } from "./tab-spacer.component";
import type { TabAlignment } from "./tab-header-item";
import { UIIcons } from "../icon/lucide-icons.generated";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-left-tabs-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./left-tabs.story.html",
  styleUrl: "./left-tabs.story.scss",
})
export class LeftTabsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/tabs/tab-group.stories.ts.
}
