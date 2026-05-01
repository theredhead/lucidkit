import { UIIcon } from "../../icon.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-sizes-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIIcon],
  templateUrl: "./sizes.story.html",
  styleUrl: "./sizes.story.scss",
})
export class SizesStorySource {

  public s = undefined as never;
  public svg = undefined as never;
}
