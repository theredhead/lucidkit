import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-explicit-html-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./explicit-html.story.html",
  styleUrl: "./explicit-html.story.scss",
})
export class ExplicitHtmlStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/rich-text-view/rich-text-view.stories.ts.
}
