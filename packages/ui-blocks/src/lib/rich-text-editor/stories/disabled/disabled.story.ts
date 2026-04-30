import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-disabled-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./disabled.story.html",
  styleUrl: "./disabled.story.scss",
})
export class DisabledStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public mode = undefined as never;
  public true = undefined as never;
  public value = undefined as never;
}
