import { UISidebarNav } from "../../sidebar-nav.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-badges-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav],
  templateUrl: "./with-badges.story.html",
  styleUrl: "./with-badges.story.scss",
})
export class WithBadgesStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/sidebar-nav/sidebar-nav.stories.ts.
}
