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
  protected readonly htmlContent =
    "<h2>Auto-detected HTML</h2><p>The strategy is inferred from the content automatically.</p><blockquote>This is a quoted passage.</blockquote>";
}
