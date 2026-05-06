import { UITimeline } from "../../timeline.component";
import { ArrayDatasource } from "@theredhead/lucid-foundation";

import { ChangeDetectionStrategy, Component } from "@angular/core";

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
  selector: "ui-vertical-start-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UITimeline],
  templateUrl: "./vertical-start.story.html",
  styleUrl: "./vertical-start.story.scss",
})
export class VerticalStartStorySource {
  protected readonly events = new ArrayDatasource(EVENTS);
}
