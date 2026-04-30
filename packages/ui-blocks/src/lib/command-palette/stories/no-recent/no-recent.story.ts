import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-no-recent-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./no-recent.story.html",
  styleUrl: "./no-recent.story.scss",
})
export class NoRecentStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/command-palette/command-palette.stories.ts.
}
