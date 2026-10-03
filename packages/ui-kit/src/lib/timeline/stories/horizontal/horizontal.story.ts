import { UITimeline } from "../../timeline.component";
import { ArrayDatasource } from "@theredhead/lucid-foundation";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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

  /**
   * Storybook control forwarded to the timeline example.
   */
  public readonly orientation = input<ReturnType<UITimeline["orientation"]>>("horizontal");

  /**
   * Storybook control forwarded to the timeline example.
   */
  public readonly alignment = input<ReturnType<UITimeline["alignment"]>>("start");

  /**
   * Storybook control forwarded to the timeline example.
   */
  public readonly ariaLabel = input<ReturnType<UITimeline["ariaLabel"]>>("Timeline");

  protected readonly events = new ArrayDatasource(EVENTS);
}
