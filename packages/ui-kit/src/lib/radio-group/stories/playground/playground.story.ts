import { UIRadioGroup } from "../../radio-group.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

import type { RadioOption } from "../../radio-group.component";

@Component({
  selector: "ui-playground-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRadioGroup],
  templateUrl: "./playground.story.html",
  styleUrl: "./playground.story.scss",
})
export class PlaygroundStorySource {
  public readonly ariaLabel = input<string | undefined>(undefined);

  public readonly disabled = input(false);

  public readonly options = input<readonly RadioOption[]>([]);
}
