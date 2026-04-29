import { Component, signal } from "@angular/core";

import { UIRadioGroup } from "../../radio-group.component";
import { UIRadioButton } from "../../radio-button.component";

@Component({
  selector: "ui-radio-demo",
  standalone: true,
  imports: [UIRadioGroup, UIRadioButton],
  templateUrl: "./default.story.html",
})
export class RadioDemo {
  public readonly selected = signal<string | undefined>(undefined);
}
