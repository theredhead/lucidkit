import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-explicit-html-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./explicit-html.story.html",
  styleUrl: "./explicit-html.story.scss",
})
export class ExplicitHtmlStorySource {

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly ariaLabel = input<ReturnType<UIRichTextView["ariaLabel"]>>("Rich text content");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly strategy = input<ReturnType<UIRichTextView["strategy"]>>("html");

  protected readonly htmlContent =
    "<h2>Rich Text</h2><p>This is <strong>bold</strong> and <em>italic</em> text.</p><ul><li>Item one</li><li>Item two</li><li>Item three</li></ul>";
}
