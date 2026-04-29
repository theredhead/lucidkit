import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-date-and-time-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./date-and-time.story.html",
  styleUrl: "./date-and-time.story.scss",
})
export class DateAndTimeStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/calendar-panel/calendar-panel.stories.ts.
}
