import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-auto-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./auto-markdown.story.html",
  styleUrl: "./auto-markdown.story.scss",
})
export class AutoMarkdownStorySource {
  protected readonly markdownContent =
    "## Auto-detected Markdown\n\nThe strategy is inferred from the content automatically.\n\n- Item one\n- Item two\n- Item three";
}
