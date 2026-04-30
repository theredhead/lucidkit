import { UIDashboard } from "../../dashboard.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-documentation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIDashboard],
  templateUrl: "./documentation.story.html",
  styleUrl: "./documentation.story.scss",
})
export class DocumentationStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/dashboard/dashboard.stories.ts.
}
