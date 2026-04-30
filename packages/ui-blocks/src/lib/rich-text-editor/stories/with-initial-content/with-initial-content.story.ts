import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-initial-content-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-initial-content.story.html",
  styleUrl: "./with-initial-content.story.scss",
})
export class WithInitialContentStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public mode = undefined as never;
  public placeholders = undefined as never;
  public value = undefined as never;
}
