import { UIRichTextEditor } from "../../rich-text-editor.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-full-featured-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextEditor],
  templateUrl: "./full-featured.story.html",
  styleUrl: "./full-featured.story.scss",
})
export class FullFeaturedStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.

  public maxLength = (500) as const;
  public mode = undefined as never;
  public placeholder = ("Compose your email template…") as const;
  public placeholders = undefined as never;
  public value = undefined as never;
}
