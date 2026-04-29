import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";

import { UIAvatar } from "@theredhead/lucid-kit";

import type { ChatMessage } from "../chat-view.types";

/**
 * A single chat message bubble with optional avatar, sender name,
 * content, and timestamp.
 *
 * The bubble adjusts its visual alignment and styling based on the
 * `isMine` input — right-aligned with accent colour for the
 * current user, left-aligned with a neutral surface for others.
 *
 * ### Usage
 * ```html
 * <ui-message-bubble [message]="msg" [isMine]="false" />
 * ```
 */
@Component({
  selector: "ui-message-bubble",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./message-bubble.component.html",
  styleUrl: "./message-bubble.component.scss",
  host: {
    class: "ui-message-bubble",
    "[class.mine]": "isMine()",
  },
})
export class UIMessageBubble<M = unknown> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** The message to render. */
  public readonly message = input.required<ChatMessage<M>>();

  /** Whether this message belongs to the current user. */
  public readonly isMine = input<boolean>(false);

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — whether content should be rendered as HTML. */
  protected readonly isRichText = computed(
    () => (this.message().type ?? "text") === "rich-text",
  );

  /** @internal — formatted short time string. */
  protected readonly timeString = computed(() => {
    const ts = this.message().timestamp;
    return ts.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  });
}
