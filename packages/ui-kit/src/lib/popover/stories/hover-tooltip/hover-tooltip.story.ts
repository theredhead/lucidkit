import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-hover-tooltip-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./hover-tooltip.story.html",
  styleUrl: "./hover-tooltip.story.scss",
})
export class HoverTooltipStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/popover/popover.stories.ts.
}
