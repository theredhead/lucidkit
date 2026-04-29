import { UISidebarNav } from "../../sidebar-nav.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-navigation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISidebarNav],
  templateUrl: "./navigation.story.html",
  styleUrl: "./navigation.story.scss",
})
export class NavigationStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/sidebar-nav/sidebar-nav.stories.ts.
}
