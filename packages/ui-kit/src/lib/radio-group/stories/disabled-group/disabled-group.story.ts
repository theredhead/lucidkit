import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-group-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./disabled-group.story.html",
  styleUrl: "./disabled-group.story.scss",
})
export class DisabledGroupStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/radio-group/radio-group.stories.ts.

  public true = undefined as never;
}
