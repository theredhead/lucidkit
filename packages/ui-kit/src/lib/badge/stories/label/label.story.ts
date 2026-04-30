import { UIBadge } from "../../badge.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type BadgeColor } from "../../badge.component";

@Component({
  selector: "ui-label-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./label.story.html",
  styleUrl: "./label.story.scss",
})
export class LabelStorySource {
  public readonly color = input<BadgeColor>("primary");

  public readonly label = input("New");
}
