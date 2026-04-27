import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UISurface } from "@theredhead/lucid-foundation";

import {
  UIIcon,
  UIIcons,
  PopoverRef,
  type UIPopoverContent,
} from "@theredhead/lucid-kit";

// ── Result type ────────────────────────────────────────────────────

/**
 * Value emitted by the image dialog popover on apply.
 * `undefined` means the dialog was cancelled.
 */
export interface ImageDialogResult {

  /** The URL of the image. */
  readonly src: string;

  /** The alt text for the image. */
  readonly alt: string;
}

// ── Component ──────────────────────────────────────────────────────

/**
 * Popover content component for inserting an image by URL.
 *
 * Receives an optional initial URL and alt text via inputs and
 * emits an {@link ImageDialogResult} on apply or `undefined` on
 * cancel / dismiss.
 *
 * @internal  Used exclusively by {@link UIRichTextEditor}.
 */
@Component({
  selector: "ui-image-dialog",
  standalone: true,
  imports: [FormsModule, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-image-dialog" },
  templateUrl: "./image-dialog.component.html",
  styleUrl: "./image-dialog.component.scss",
})
export class UIImageDialog implements UIPopoverContent<ImageDialogResult> {
  public readonly popoverRef = inject(PopoverRef<ImageDialogResult>);

  /** Pre-filled image URL (set via input by PopoverService). */
  public readonly initialSrc = input<string>("");

  /** Pre-filled alt text (set via input by PopoverService). */
  public readonly initialAlt = input<string>("");

  /** Mutable URL value for the form. @internal */
  public readonly src = signal("");

  /** Mutable alt-text value for the form. @internal */
  public readonly alt = signal("");

  /** @internal */
  public readonly imageIcon = UIIcons.Lucide.Files.ImagePlus;

  public constructor() {
    queueMicrotask(() => {
      this.src.set(this.initialSrc());
      this.alt.set(this.initialAlt());
    });
  }

  /** Apply the image insertion and close the popover with the result. */
  public apply(): void {
    const src = this.src().trim();
    if (!src) return;
    this.popoverRef.close({ src, alt: this.alt().trim() || "" });
  }

  /** Cancel and dismiss the popover without a result. */
  public cancel(): void {
    this.popoverRef.close(undefined);
  }
}
