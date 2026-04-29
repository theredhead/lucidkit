import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-no-page-size-selector-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./no-page-size-selector.story.html",
  styleUrl: "./no-page-size-selector.story.scss",
})
export class NoPageSizeSelectorStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/pagination/pagination.stories.ts.
}
