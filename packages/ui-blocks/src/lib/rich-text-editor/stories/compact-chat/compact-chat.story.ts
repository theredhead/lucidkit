import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-compact-chat-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./compact-chat.story.html",
  styleUrl: "./compact-chat.story.scss",
})
export class CompactChatStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public ariaLabel = ("Chat composer") as const;
  public mode = ("markdown") as const;
  public placeholder = ("Message…") as const;
  public presentation = ("compact") as const;
  public value = undefined as never;
}
