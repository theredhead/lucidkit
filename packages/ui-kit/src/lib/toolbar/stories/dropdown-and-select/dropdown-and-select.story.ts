import { UIToolbar } from "../../toolbar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-dropdown-and-select-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar],
  templateUrl: "./dropdown-and-select.story.html",
  styleUrl: "./dropdown-and-select.story.scss",
})
export class DropdownAndSelectStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toolbar/toolbar.stories.ts.
}
