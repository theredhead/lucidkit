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
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/drawer/drawer.stories.ts.
}
