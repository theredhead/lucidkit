import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type BadgeColor } from "../../badge.component";

@Component({
  selector: "ui-count-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./count.story.html",
  styleUrl: "./count.story.scss",
})
export class CountStorySource {
  public readonly color = input<BadgeColor>("danger");

  public readonly count = input(5);

  public readonly maxCount = input(99);
}
