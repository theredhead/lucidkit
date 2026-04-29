import { UISidebarNav } from "../../sidebar-nav.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-collapsed-groups-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav],
  templateUrl: "./collapsed-groups.story.html",
  styleUrl: "./collapsed-groups.story.scss",
})
export class CollapsedGroupsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/sidebar-nav/sidebar-nav.stories.ts.
}
