// ── UIRichTextContentDialog ─────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";

import {
  ModalRef,
  type UIModalContent,
  UIRichTextEditor,
} from "@theredhead/lucid-kit";
import { UISurface } from '@theredhead/lucid-foundation';

/**
 * Modal dialog for editing the HTML content of a `flair:richtext`
 * field in the form designer.
 *
 * Opens a full {@link UIRichTextEditor} inside a native `<dialog>`
 * with Apply / Cancel actions.
 *
 * @internal  Used exclusively by {@link UIPropertyInspector}.
 */
@Component({
  selector: "ui-richtext-content-dialog",
  standalone: true,
  imports: [UIRichTextEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-richtext-content-dialog" },
  templateUrl: "./richtext-content-dialog.component.html",
  styleUrl: "./richtext-content-dialog.component.scss",
})
export class UIRichTextContentDialog implements UIModalContent<string> {
  public readonly modalRef = inject(ModalRef<string>);

  /** Pre-filled HTML content (set via input by ModalService). */
  public readonly initialContent = input<string>("");

  /** Mutable content value for the editor. @internal */
  protected readonly content = signal("");

  public constructor() {
    queueMicrotask(() => {
      this.content.set(this.initialContent());
    });
  }

  /** @internal Called when the editor emits a value change. */
  protected onValueChange(html: string): void {
    this.content.set(html);
  }

  /** Apply and close the dialog with the edited content. */
  protected apply(): void {
    this.modalRef.close(this.content());
  }

  /** Cancel and dismiss the dialog without a result. */
  protected cancel(): void {
    this.modalRef.close(undefined);
  }
}
