import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-item-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./disabled-item.story.html",
  styleUrl: "./disabled-item.story.scss",
})
export class DisabledItemStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/radio-group/radio-group.stories.ts.

  public true = undefined as never;
}
