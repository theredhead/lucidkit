import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-switch-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./switch.story.html",
  styleUrl: "./switch.story.scss",
})
export class SwitchStorySource {
  public readonly variant = input<"checkbox" | "switch">("switch");
  public readonly checked = model(false);
  public readonly disabled = input(false);
  public readonly indeterminate = input(false);
  public readonly ariaLabel = input("Enable notifications");
}
