import { UIGauge } from "../../gauge.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-custom-formatter-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIGauge],
  templateUrl: "./custom-formatter.story.html",
  styleUrl: "./custom-formatter.story.scss",
})
export class CustomFormatterStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/gauge/gauge.stories.ts.
}
