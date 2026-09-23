import { UIInput } from "../../input.component";

import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

@Component({
  selector: "ui-plain-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIInput],
  templateUrl: "./plain.story.html",
  styleUrl: "./plain.story.scss",
})
export class PlainStorySource {
  public readonly name = model("");
  public readonly type = input("text");
  public readonly placeholder = input("Enter your name");
  public readonly disabled = input(false);
  public readonly multiline = input(false);
  public readonly rows = input(3);
}
