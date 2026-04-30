import { UIToolbar } from "../../toolbar.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-floating-toggle-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIToolbar],
  templateUrl: "./floating-toggle.story.html",
  styleUrl: "./floating-toggle.story.scss",
})
export class FloatingToggleStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/toolbar/toolbar.stories.ts.
}
