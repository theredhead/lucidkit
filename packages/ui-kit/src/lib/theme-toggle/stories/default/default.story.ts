import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIThemeToggle } from "../../theme-toggle.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIThemeToggle],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly variant = input<"icon" | "button">("icon");
  public readonly disabled = input<boolean>(false);
  public readonly ariaLabel = input<string>("Toggle theme");
}
