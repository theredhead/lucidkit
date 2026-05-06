import { UITimeline } from "../../timeline.component";
import { ArrayDatasource } from "@theredhead/lucid-foundation";

import { ChangeDetectionStrategy, Component } from "@angular/core";

interface TimelineEvent {
  title: string;
  date: string;
}

const EVENTS: TimelineEvent[] = [
  { title: "Idea", date: "Jan" },
  { title: "Design", date: "Feb" },
  { title: "Build", date: "Mar" },
  { title: "Test", date: "Apr" },
  { title: "Ship", date: "May" },
];

@Component({
  selector: "ui-horizontal-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./horizontal.story.html",
  styleUrl: "./horizontal.story.scss",
})
export class HorizontalStorySource {
  protected readonly events = new ArrayDatasource(EVENTS);
}
