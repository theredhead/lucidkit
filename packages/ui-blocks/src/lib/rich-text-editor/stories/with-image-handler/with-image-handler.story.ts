import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-with-image-handler-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./with-image-handler.story.html",
  styleUrl: "./with-image-handler.story.scss",
})
export class WithImageHandlerStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public imageHandler = undefined as never;
  public mode = undefined as never;
  public placeholder = ("Paste an image here…") as const;
}
