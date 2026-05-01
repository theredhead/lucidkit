import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-disabled-group-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./disabled-group.story.html",
  styleUrl: "./disabled-group.story.scss",
})
export class DisabledGroupStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly disabled = input(true);
}
