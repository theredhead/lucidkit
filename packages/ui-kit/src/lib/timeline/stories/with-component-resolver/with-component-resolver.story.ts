import { UITimeline } from "../../timeline.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-component-resolver-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./with-component-resolver.story.html",
  styleUrl: "./with-component-resolver.story.scss",
})
export class WithComponentResolverStorySource {
}
