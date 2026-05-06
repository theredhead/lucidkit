import { UITimeline } from "../../timeline.component";
import { type TimelineComponentResolver } from "../../timeline.types";
import { ArrayDatasource } from "@theredhead/lucid-foundation";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

interface TimelineEvent {
  title: string;
  date: string;
  description: string;
}

const EVENTS: TimelineEvent[] = [
  {
    title: "Project Kickoff",
    date: "2024-01-10",
    description: "Initial planning and scope definition.",
  },
  {
    title: "Design Review",
    date: "2024-02-14",
    description: "UI/UX designs approved by stakeholders.",
  },
  {
    title: "Alpha Release",
    date: "2024-03-20",
    description: "First internal alpha made available.",
  },
  {
    title: "Beta Launch",
    date: "2024-04-15",
    description: "Public beta opened to early adopters.",
  },
  {
    title: "v1.0 Released",
    date: "2024-05-01",
    description: "General availability shipped.",
  },
];

@Component({
  standalone: true,
  selector: "ui-timeline-event-card",
  template: `
    <div class="card">
      <strong>{{ event().title }}</strong>
      <time>{{ event().date }}</time>
      <p>{{ event().description }}</p>
    </div>
  `,
  styles: [
    `
      .card {
        padding: 0.75rem 1rem;
        color: var(--ui-text, #1d232b);
        background: var(--ui-surface, #f7f8fa);
        border-radius: 0.5rem;
      }
    `,
  ],
})
export class TimelineEventCard {
  public readonly event = input.required<TimelineEvent>();
}

@Component({
  selector: "ui-with-component-resolver-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./with-component-resolver.story.html",
  styleUrl: "./with-component-resolver.story.scss",
})
export class WithComponentResolverStorySource {
  protected readonly events = new ArrayDatasource(EVENTS);
  protected readonly resolver: TimelineComponentResolver<TimelineEvent> = () =>
    TimelineEventCard;
}
