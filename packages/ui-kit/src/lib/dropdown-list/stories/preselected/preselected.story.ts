import { UIDropdownList, UIDropdownListPanel } from "../../dropdown-list.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-preselected-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownList, UIDropdownListPanel],
  templateUrl: "./preselected.story.html",
  styleUrl: "./preselected.story.scss",
})
export class PreselectedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/dropdown-list/dropdown-list.stories.ts.
}
