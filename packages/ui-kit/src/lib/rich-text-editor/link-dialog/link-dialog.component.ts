import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { UIIcon } from "../../icon/icon.component";
import { UIIcons } from "../../icon/lucide-icons.generated";
import { PopoverRef, type UIPopoverContent } from "../../popover/popover.types";
import { UISurface } from '@theredhead/lucid-foundation';

// ── Result type ────────────────────────────────────────────────────

/**
 * Value emitted by the link dialog popover on apply.
 * `undefined` means the dialog was cancelled.
 */
export interface LinkDialogResult {

  /** The URL the link should point to. */
  readonly url: string;

  /** The display text for the link. */
  readonly text: string;
}

// ── Component ──────────────────────────────────────────────────────

/**
 * Popover content component for inserting or editing a hyperlink.
 *
 * Receives the initial URL and display-text values via inputs and
 * emits a {@link LinkDialogResult} on apply or `undefined` on
 * cancel / dismiss.
 *
 * @internal  Used exclusively by {@link UIRichTextEditor}.
 */
@Component({
  selector: "ui-link-dialog",
  standalone: true,
  imports: [FormsModule, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-link-dialog" },
  templateUrl: "./link-dialog.component.html",
  styleUrl: "./link-dialog.component.scss",
})
export class UILinkDialog implements UIPopoverContent<LinkDialogResult> {
  readonly popoverRef = inject(PopoverRef<LinkDialogResult>);

  /** Pre-filled URL (set via input by PopoverService). */
  readonly initialUrl = input<string>("");

  /** Pre-filled display text (set via input by PopoverService). */
  readonly initialText = input<string>("");

  /** Whether we are editing an existing link (changes button label). */
  readonly editMode = input<boolean>(false);

  /** Mutable URL value for the form. @internal */
  readonly url = signal("");

  /** Mutable display-text value for the form. @internal */
  readonly text = signal("");

  /** @internal */
  readonly linkIcon = UIIcons.Lucide.Text.Link;

  constructor() {
    // Sync initial inputs → mutable signals after inputs resolve.
    // We use a microtask because signal inputs are set after
    // construction by ComponentRef.setInput().
    queueMicrotask(() => {
      this.url.set(this.initialUrl());
      this.text.set(this.initialText());
    });
  }

  /** Apply the link and close the popover with the result. */
  apply(): void {
    const url = this.url().trim();
    if (!url) return;
    this.popoverRef.close({ url, text: this.text().trim() || url });
  }

  /** Cancel and dismiss the popover without a result. */
  cancel(): void {
    this.popoverRef.close(undefined);
  }
}
