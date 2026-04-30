import { UIThemeToggle } from "../../theme-toggle.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIThemeToggle],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public ariaLabel = "Toggle theme" as const;

  public disabled = false as const;

  public variant = "icon" as const;

  // Review required: this scaffold was generated from packages/ui-kit/src/lib/theme-toggle/theme-toggle.stories.ts.
}
