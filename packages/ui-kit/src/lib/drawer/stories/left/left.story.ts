import { UIDrawer } from "../../drawer.component";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-left-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDrawer, UIButton],
  templateUrl: "./left.story.html",
  styleUrl: "./left.story.scss",
})
export class LeftStorySource {
}
