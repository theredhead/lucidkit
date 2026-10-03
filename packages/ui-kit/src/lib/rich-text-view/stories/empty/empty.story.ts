import { UIRichTextView } from "../../rich-text-view.component";

import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "ui-empty-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIRichTextView],
  templateUrl: "./empty.story.html",
  styleUrl: "./empty.story.scss",
})
export class EmptyStorySource {

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly content = input<ReturnType<UIRichTextView["content"]>>("");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly strategy = input<ReturnType<UIRichTextView["strategy"]>>("auto");

  /**
   * Storybook control forwarded to the rich-text-view example.
   */
  public readonly ariaLabel = input<ReturnType<UIRichTextView["ariaLabel"]>>("Empty content");

}
