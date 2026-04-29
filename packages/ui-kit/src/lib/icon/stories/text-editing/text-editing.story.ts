import { UIIcon } from "../../icon.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-text-editing-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./text-editing.story.html",
  styleUrl: "./text-editing.story.scss",
})
export class TextEditingStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/icon/icon.stories.ts.
}
