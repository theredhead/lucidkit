import { UIChart } from "../../chart.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-stacked-bar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChart],
  templateUrl: "./stacked-bar.story.html",
  styleUrl: "./stacked-bar.story.scss",
})
export class StackedBarStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/chart/chart.stories.ts.
}
