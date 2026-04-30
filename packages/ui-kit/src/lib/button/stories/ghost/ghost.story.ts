import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "../../button.component";

@Component({
  selector: "ui-ghost-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./ghost.story.html",
  styleUrl: "./ghost.story.scss",
})
export class GhostStorySource {
  public readonly color = input<ButtonColor>("neutral");

  public readonly disabled = input(false);

  public readonly pill = input(false);

  public readonly size = input<ButtonSize>("medium");

  public readonly variant = input<ButtonVariant>("ghost");
}
