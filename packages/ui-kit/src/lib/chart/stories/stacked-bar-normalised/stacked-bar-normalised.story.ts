import { UIChart } from "../../chart.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-stacked-bar-normalised-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIChart],
  templateUrl: "./stacked-bar-normalised.story.html",
  styleUrl: "./stacked-bar-normalised.story.scss",
})
export class StackedBarNormalisedStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/chart/chart.stories.ts.
}
