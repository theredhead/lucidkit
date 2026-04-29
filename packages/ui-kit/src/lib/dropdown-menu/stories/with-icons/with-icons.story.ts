import { UIDropdownMenu } from "../../dropdown-menu.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-icons-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu],
  templateUrl: "./with-icons.story.html",
  styleUrl: "./with-icons.story.scss",
})
export class WithIconsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/dropdown-menu/dropdown-menu.stories.ts.
}
