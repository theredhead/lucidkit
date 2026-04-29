import { UIGanttChart } from "../../gantt-chart.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-documentation-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGanttChart],
  templateUrl: "./documentation.story.html",
  styleUrl: "./documentation.story.scss",
})
export class DocumentationStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gantt-chart/gantt-chart.stories.ts.
}
