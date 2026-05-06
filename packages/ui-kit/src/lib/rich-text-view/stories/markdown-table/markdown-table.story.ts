import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "ui-markdown-table-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./markdown-table.story.html",
  styleUrl: "./markdown-table.story.scss",
})
export class MarkdownTableStorySource {
  protected readonly markdownContent =
    "| Name | Role | Status |\n|------|------|--------|\n| Alice | Engineer | Active |\n| Bob | Designer | Active |\n| Carol | Manager | On leave |";
}
