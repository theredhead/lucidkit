import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-table-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./markdown-table.story.html",
  styleUrl: "./markdown-table.story.scss",
})
export class MarkdownTableStorySource {
  // Review required: this scaffold was generated from packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.stories.ts.
}
