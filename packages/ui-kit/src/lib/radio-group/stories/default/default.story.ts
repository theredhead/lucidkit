import { Component, input, signal } from "@angular/core";

import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

@Component({
  selector: "ui-radio-demo",
  standalone: true,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./default.story.html",
})
export class RadioDemo {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly disabled = input(false);

  public readonly selected = signal<string | undefined>(undefined);
}
