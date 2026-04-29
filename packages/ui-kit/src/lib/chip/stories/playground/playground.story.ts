import { UIChip } from "../../chip.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChip],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/chip/chip.stories.ts.

  public ariaLabel = ("Sample chip") as const;
  public color = ("primary") as const;
  public disabled = (false) as const;
  public removable = (false) as const;
}
