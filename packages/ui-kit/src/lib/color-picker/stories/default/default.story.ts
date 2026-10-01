import { UIColorPicker } from "../../color-picker.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIColorPicker],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly value = model("#0061a4");
  public readonly initialMode = input("theme");
  public readonly disabled = input(false);
  public readonly ariaLabel = input("Pick a colour");
}
