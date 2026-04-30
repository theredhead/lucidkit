import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown.story.html",
  styleUrl: "./markdown.story.scss",
})
export class MarkdownStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public ariaLabel = ("Markdown editor") as const;
  public mode = ("markdown") as const;
  public placeholder = ("Write Markdown here…") as const;
}
