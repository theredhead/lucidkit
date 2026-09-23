import { UIBadge } from "../../badge.component";

import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIBadge],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly count = model(5);
  public readonly variant = input<"count" | "dot" | "label">("count");
  public readonly color = input<
    "primary" | "success" | "warning" | "danger" | "neutral"
  >("danger");
  public readonly muted = input(false);
  public readonly maxCount = input(99);
}
