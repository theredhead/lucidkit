import { UIIcon } from "../../icon.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-icons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./custom-icons.story.html",
  styleUrl: "./custom-icons.story.scss",
})
export class CustomIconsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/icon/icon.stories.ts.
}
