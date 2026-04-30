import { UIToolbar } from "../../toolbar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-button-groups-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar],
  templateUrl: "./button-groups.story.html",
  styleUrl: "./button-groups.story.scss",
})
export class ButtonGroupsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toolbar/toolbar.stories.ts.
}
