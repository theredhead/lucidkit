import { UIRating } from "../../rating.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRating],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly value = model(3);
  public readonly max = input(5);
  public readonly readonly = input(false);
  public readonly disabled = input(false);
  public readonly size = input<"small" | "medium" | "large">("medium");
}
