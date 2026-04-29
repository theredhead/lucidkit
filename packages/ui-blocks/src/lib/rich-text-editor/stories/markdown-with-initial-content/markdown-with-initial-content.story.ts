import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-with-initial-content-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./markdown-with-initial-content.story.html",
  styleUrl: "./markdown-with-initial-content.story.scss",
})
export class MarkdownWithInitialContentStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
