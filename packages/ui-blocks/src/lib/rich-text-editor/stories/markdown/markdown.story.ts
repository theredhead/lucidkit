import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./markdown.story.html",
  styleUrl: "./markdown.story.scss",
})
export class MarkdownStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
