import { UIToolbar } from "../../toolbar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-toggle-tools-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar],
  templateUrl: "./toggle-tools.story.html",
  styleUrl: "./toggle-tools.story.scss",
})
export class ToggleToolsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toolbar/toolbar.stories.ts.
}
