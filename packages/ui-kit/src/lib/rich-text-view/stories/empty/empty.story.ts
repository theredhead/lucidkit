import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-empty-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./empty.story.html",
  styleUrl: "./empty.story.scss",
})
export class EmptyStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/rich-text-view/rich-text-view.stories.ts.
}
