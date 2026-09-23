import { UICheckbox } from "../../checkbox.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UICheckbox],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly variant = input<"checkbox" | "switch">("checkbox");
  public readonly checked = model(false);
  public readonly disabled = input(false);
  public readonly indeterminate = input(false);
  public readonly ariaLabel = input("Accept terms");
}
