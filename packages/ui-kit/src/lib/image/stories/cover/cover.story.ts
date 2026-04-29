import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-cover-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cover.story.html",
  styleUrl: "./cover.story.scss",
})
export class CoverStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/image/image.stories.ts.
}
