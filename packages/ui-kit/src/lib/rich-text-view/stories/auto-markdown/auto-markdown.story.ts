import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-auto-markdown-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./auto-markdown.story.html",
  styleUrl: "./auto-markdown.story.scss",
})
export class AutoMarkdownStorySource {

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly strategy = input<ReturnType<UIRichTextView["strategy"]>>("auto");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly ariaLabel = input<ReturnType<UIRichTextView["ariaLabel"]>>("Markdown content");

  protected readonly markdownContent =
    "## Auto-detected Markdown\n\nThe strategy is inferred from the content automatically.\n\n- Item one\n- Item two\n- Item three";
}
