import { UIDrawer } from "../../drawer.component";
import { UIButton } from "../../../button/button.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-widths-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDrawer, UIButton],
  templateUrl: "./widths.story.html",
  styleUrl: "./widths.story.scss",
})
export class WidthsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/drawer/drawer.stories.ts.
}
