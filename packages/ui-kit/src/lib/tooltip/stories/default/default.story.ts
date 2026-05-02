import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIButton } from "../../../button/button.component";
import { UITooltip } from "../../tooltip.directive";
import type { TooltipPosition } from "../../tooltip.types";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITooltip, UIButton],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly uiTooltip = input("This is a tooltip");

  public readonly tooltipPosition = input<TooltipPosition>("top");

  public readonly tooltipDelay = input(200);
}
