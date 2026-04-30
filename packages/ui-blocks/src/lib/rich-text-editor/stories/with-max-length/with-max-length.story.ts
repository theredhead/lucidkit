import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-max-length-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-max-length.story.html",
  styleUrl: "./with-max-length.story.scss",
})
export class WithMaxLengthStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public maxLength = (200) as const;
  public mode = undefined as never;
  public placeholder = ("Limited to 200 characters…") as const;
}
