import { UIChart } from "../../chart.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-side-by-side-comparison-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChart],
  templateUrl: "./side-by-side-comparison.story.html",
  styleUrl: "./side-by-side-comparison.story.scss",
})
export class SideBySideComparisonStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/chart/chart.stories.ts.
}
