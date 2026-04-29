import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/checkbox/checkbox.stories.ts.
}
