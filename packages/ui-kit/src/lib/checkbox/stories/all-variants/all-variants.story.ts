import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-all-variants-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./all-variants.story.html",
  styleUrl: "./all-variants.story.scss",
})
export class AllVariantsStorySource {
  protected unchecked = false;
  protected checked = true;
  protected indeterminate = false;
  protected switchOff = false;
  protected switchOn = true;
}
