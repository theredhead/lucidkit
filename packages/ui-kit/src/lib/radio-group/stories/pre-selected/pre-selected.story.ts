import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-pre-selected-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./pre-selected.story.html",
  styleUrl: "./pre-selected.story.scss",
})
export class PreSelectedStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly disabled = input(false);
}
