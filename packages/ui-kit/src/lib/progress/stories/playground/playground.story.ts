import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import { UIProgress } from "../../progress.component";
import type { ProgressMode, ProgressVariant } from "../../progress.types";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIProgress],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly variant = input<ProgressVariant>("linear");
  public readonly mode = input<ProgressMode>("determinate");
  public readonly value = input<number>(65);
  public readonly ariaLabel = input<string>("Progress");
}
