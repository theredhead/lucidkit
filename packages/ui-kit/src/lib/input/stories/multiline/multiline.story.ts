import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-multiline-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./multiline.story.html",
  styleUrl: "./multiline.story.scss",
})
export class MultilineStorySource {
  public readonly description = model("");
  public readonly type = input("text");
  public readonly placeholder = input("Enter description…");
  public readonly disabled = input(false);
  public readonly multiline = input(true);
  public readonly rows = input(4);
}
