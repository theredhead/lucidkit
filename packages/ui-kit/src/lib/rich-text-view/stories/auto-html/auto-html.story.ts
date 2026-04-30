import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-auto-html-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./auto-html.story.html",
  styleUrl: "./auto-html.story.scss",
})
export class AutoHtmlStorySource {
  // Review required: this scaffold was generated from packages/ui-kit/src/lib/rich-text-view/rich-text-view.stories.ts.
}
