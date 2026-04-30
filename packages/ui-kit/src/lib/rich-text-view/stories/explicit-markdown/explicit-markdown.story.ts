import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-explicit-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./explicit-markdown.story.html",
  styleUrl: "./explicit-markdown.story.scss",
})
export class ExplicitMarkdownStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/rich-text-view/rich-text-view.stories.ts.
}
