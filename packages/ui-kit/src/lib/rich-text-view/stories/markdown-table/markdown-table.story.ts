import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-markdown-table-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./markdown-table.story.html",
  styleUrl: "./markdown-table.story.scss",
})
export class MarkdownTableStorySource {

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly ariaLabel = input<ReturnType<UIRichTextView["ariaLabel"]>>("Markdown table demo");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly strategy = input<ReturnType<UIRichTextView["strategy"]>>("markdown");

  protected readonly markdownContent =
    "| Name | Role | Status |\n|------|------|--------|\n| Alice | Engineer | Active |\n| Bob | Designer | Active |\n| Carol | Manager | On leave |";
}
