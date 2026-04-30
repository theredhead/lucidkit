import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type BadgeColor, type BadgeVariant } from "../../badge.component";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input<string | undefined>("Notification badge");

  public readonly color = input<BadgeColor>("primary");

  public readonly count = input(5);

  public readonly label = input("Label");

  public readonly maxCount = input(99);

  public readonly variant = input<BadgeVariant>("count");
}
