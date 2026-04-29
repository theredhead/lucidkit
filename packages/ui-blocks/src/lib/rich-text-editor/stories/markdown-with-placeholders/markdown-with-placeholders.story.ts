import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-with-placeholders-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./markdown-with-placeholders.story.html",
  styleUrl: "./markdown-with-placeholders.story.scss",
})
export class MarkdownWithPlaceholdersStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
