import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

/**
 * A read-only rich text renderer.
 *
 * Displays HTML content inline without any editing chrome.
 * Used by the form engine for `flair:richtext` elements.
 *
 * @example
 * ```html
 * <ui-rich-text-view [content]="'<p>Hello <strong>world</strong></p>'" />
 * ```
 */
@Component({
  selector: "ui-rich-text-view",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-rich-text-view",
  },
  template: `<div class="rtv-content" [innerHTML]="content()"></div>`,
  styleUrl: "./rich-text-view.component.scss",
})
export class UIRichTextView {
  /** The HTML content to render. */
  public readonly content = model<string>("");

  /** Accessible label for the container. */
  public readonly ariaLabel = input<string>("Rich text content");
}
