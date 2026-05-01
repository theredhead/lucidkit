import { UITimeline } from "../../timeline.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-vertical-alternate-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./vertical-alternate.story.html",
  styleUrl: "./vertical-alternate.story.scss",
})
export class VerticalAlternateStorySource {
}
