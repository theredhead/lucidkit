import { UIDropdownMenu } from "../../dropdown-menu.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-alignment-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDropdownMenu],
  templateUrl: "./alignment.story.html",
  styleUrl: "./alignment.story.scss",
})
export class AlignmentStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/dropdown-menu/dropdown-menu.stories.ts.
}
