import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-disabled-item-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./disabled-item.story.html",
  styleUrl: "./disabled-item.story.scss",
})
export class DisabledItemStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly disabled = input(false);
}
