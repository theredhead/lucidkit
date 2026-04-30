import { UIButton } from "../../button.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "../../button.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIButton],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly color = input<ButtonColor>("primary");

  public readonly disabled = input(false);

  public readonly pill = input(false);

  public readonly size = input<ButtonSize>("medium");

  public readonly variant = input<ButtonVariant>("filled");
}
