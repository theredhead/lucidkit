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
  protected readonly markdownContent =
    '## Explicit Markdown\n\nThis content is **always** rendered as _Markdown_, regardless of auto-detection.\n\n```js\nconsole.log("Hello, world!");\n```';
}
