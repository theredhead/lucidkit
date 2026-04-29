import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-full-featured-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./full-featured.story.html",
  styleUrl: "./full-featured.story.scss",
})
export class FullFeaturedStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
