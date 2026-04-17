import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { UISurface } from "@theredhead/lucid-foundation";

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
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-rich-text-view",
  },
  templateUrl: "./rich-text-view.component.html",
  styleUrl: "./rich-text-view.component.scss",
})
export class UIRichTextView {
  private readonly sanitizer = inject(DomSanitizer);
  /** The raw HTML content to render. */
  public readonly content = model<string>("");

  /** The HTML content to render, as trusted */
  public readonly trustedContent = computed(() => {
    this.sanitizer.bypassSecurityTrustHtml(this.content());
  });

  /** Accessible label for the container. */
  public readonly ariaLabel = input<string>("Rich text content");
}
