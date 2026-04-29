import { UIDropdownMenu } from "../../dropdown-menu.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-basic-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu],
  templateUrl: "./basic.story.html",
  styleUrl: "./basic.story.scss",
})
export class BasicStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/dropdown-menu/dropdown-menu.stories.ts.
}
