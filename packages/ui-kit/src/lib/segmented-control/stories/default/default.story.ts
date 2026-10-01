import { UISegmentedControl } from "../../segmented-control.component";

import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";
import type { SegmentedItem } from "../../segmented-control.component";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UISegmentedControl],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  public readonly disabled = input(false);
  public readonly indicatorColor = input("primary");
  public readonly activeView = signal("week");
  public readonly viewItems: readonly SegmentedItem[] = [
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
  ];
}
