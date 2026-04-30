import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "../../button.component";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  public readonly color = input<ButtonColor>("primary");

  public readonly disabled = input(true);

  public readonly pill = input(false);

  public readonly size = input<ButtonSize>("medium");

  public readonly variant = input<ButtonVariant>("filled");
}
