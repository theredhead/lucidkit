import { UIThemeToggle } from "../../theme-toggle.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-button-variant-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIThemeToggle],
  templateUrl: "./button-variant.story.html",
  styleUrl: "./button-variant.story.scss",
})
export class ButtonVariantStorySource {
}
