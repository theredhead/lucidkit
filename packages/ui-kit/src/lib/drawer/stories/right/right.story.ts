import { UIDrawer } from "../../drawer.component";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-right-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDrawer, UIButton],
  templateUrl: "./right.story.html",
  styleUrl: "./right.story.scss",
})
export class RightStorySource {
}
