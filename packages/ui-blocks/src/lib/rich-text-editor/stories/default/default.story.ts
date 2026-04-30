import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-default-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./default.story.html",
  styleUrl: "./default.story.scss",
})
export class DefaultStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public ariaLabel = ("Rich text editor") as const;
  public disabled = (false) as const;
  public mode = ("html") as const;
  public placeholder = ("Type here…") as const;
  public readonly = (false) as const;
}
