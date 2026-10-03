import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-auto-html-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./auto-html.story.html",
  styleUrl: "./auto-html.story.scss",
})
export class AutoHtmlStorySource {

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly strategy = input<ReturnType<UIRichTextView["strategy"]>>("auto");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly ariaLabel = input<ReturnType<UIRichTextView["ariaLabel"]>>("Rich text content");

  protected readonly htmlContent =
    "<h2>Auto-detected HTML</h2><p>The strategy is inferred from the content automatically.</p><blockquote>This is a quoted passage.</blockquote>";
}
