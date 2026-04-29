import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-min-max-constraints-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./min-max-constraints.story.html",
  styleUrl: "./min-max-constraints.story.scss",
})
export class MinMaxConstraintsStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/calendar-panel/calendar-panel.stories.ts.
}
