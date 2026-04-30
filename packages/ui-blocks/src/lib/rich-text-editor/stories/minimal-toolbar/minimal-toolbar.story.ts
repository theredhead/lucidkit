import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-minimal-toolbar-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./minimal-toolbar.story.html",
  styleUrl: "./minimal-toolbar.story.scss",
})
export class MinimalToolbarStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public mode = undefined as never;
  public toolbarActions = undefined as never;
}
