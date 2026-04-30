import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-max-length-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./markdown-max-length.story.html",
  styleUrl: "./markdown-max-length.story.scss",
})
export class MarkdownMaxLengthStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public maxLength = (150) as const;
  public mode = ("markdown") as const;
  public value = undefined as never;
}
