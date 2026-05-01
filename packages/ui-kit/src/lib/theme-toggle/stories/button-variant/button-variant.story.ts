import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIThemeToggle } from "../../theme-toggle.component";

@Component({
  selector: "ui-button-variant-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIThemeToggle],
  templateUrl: "./button-variant.story.html",
  styleUrl: "./button-variant.story.scss",
})
export class ButtonVariantStorySource {
  public readonly variant = input<"icon" | "button">("button");
  public readonly disabled = input<boolean>(false);
  public readonly ariaLabel = input<string>("Switch theme");
}
