import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type BadgeColor } from "../../badge.component";

@Component({
  selector: "ui-dot-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./dot.story.html",
  styleUrl: "./dot.story.scss",
})
export class DotStorySource {
  public readonly color = input<BadgeColor>("success");
}
