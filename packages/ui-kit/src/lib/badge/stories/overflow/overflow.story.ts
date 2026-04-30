import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type BadgeColor } from "../../badge.component";

@Component({
  selector: "ui-overflow-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./overflow.story.html",
  styleUrl: "./overflow.story.scss",
})
export class OverflowStorySource {
  public readonly color = input<BadgeColor>("danger");

  public readonly count = input(128);

  public readonly maxCount = input(99);
}
