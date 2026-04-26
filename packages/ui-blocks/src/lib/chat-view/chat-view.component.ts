import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

import { UIIcon, UIIcons, UIRichTextEditor } from "@theredhead/lucid-kit";

import type {
  ChatComposerMode,
  ChatMessage,
  ChatParticipant,
  MessageDateGroup,
  MessageSendEvent,
  MessageTemplateContext,
} from "./chat-view.types";
import type { RichTextFormatAction } from "@theredhead/lucid-kit";
import { UIMessageBubble } from "./message-bubble/message-bubble.component";
import { UISurface } from "@theredhead/lucid-foundation";

/**
 * A chat / messaging view composing UIAvatar, UIRichTextEditor,
 * and a scrollable message list with a composer bar.
 *
 * Messages are supplied via the `messages` input. The component
 * groups them by date and renders each with sender avatar, bubble,
 * and timestamp. The current user's messages are right-aligned.
 *
 * The composer bar supports both plain-text (`textarea`) and
 * rich-text (`UIRichTextEditor`) modes via the `composerMode`
 * input.
 *
 * Custom message templates can be projected using a
 * `#messageTemplate` content child.
 *
 * ### Basic usage
 * ```html
 * <ui-chat-view
 *   [messages]="messages"
 *   [currentUser]="me"
 *   (messageSend)="onSend($event)"
 * />
 * ```
 *
 * ### Rich-text composer
 * ```html
 * <ui-chat-view
 *   [messages]="messages"
 *   [currentUser]="me"
 *   composerMode="rich-text"
 *   (messageSend)="onSend($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-chat-view",
  standalone: true,
  imports: [NgTemplateOutlet, UIIcon, UIMessageBubble, UIRichTextEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  templateUrl: "./chat-view.component.html",
  styleUrl: "./chat-view.component.scss",
  host: {
    class: "ui-chat-view",
  },
})
export class UIChatView<M = unknown> implements AfterViewInit {
  /** @internal Compact chat composer toolbar actions. */
  private static readonly DEFAULT_COMPACT_COMPOSER_ACTIONS: readonly RichTextFormatAction[] =
    ["bold", "italic", "strikethrough", "link"];

  // ── Inputs ────────────────────────────────────────────────────────

  /** The list of messages to display. */
  public readonly messages = input<readonly ChatMessage<M>[]>([]);

  /** The current user (their messages are right-aligned). */
  public readonly currentUser = input.required<ChatParticipant>();

  /** Composer input mode. */
  public readonly composerMode = input<ChatComposerMode>("text");

  /**
   * Rich-text composer presentation.
   *
   * - `'compact'` — small floating-toolbar composer (default)
   * - `'default'` — full rich-text editor chrome
   */
  public readonly composerPresentation = input<"default" | "compact">(
    "compact",
  );

  /**
   * Toolbar actions for the compact rich-text composer.
   *
   * Defaults to a small chat-oriented set.
   */
  public readonly composerToolbarActions = input<
    readonly RichTextFormatAction[]
  >(UIChatView.DEFAULT_COMPACT_COMPOSER_ACTIONS);

  /** Placeholder text for the composer. */
  public readonly placeholder = input<string>("Type a message…");

  /** Accessible label for the chat view. */
  public readonly ariaLabel = input<string>("Chat");

  // ── Content children ──────────────────────────────────────────────

  /**
   * Optional custom template for rendering individual messages.
   * Receives a {@link MessageTemplateContext}.
   */
  public readonly messageTemplate =
    contentChild<TemplateRef<MessageTemplateContext<M>>>(TemplateRef);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emitted when the user sends a message. */
  public readonly messageSend = output<MessageSendEvent>();

  // ── View queries ──────────────────────────────────────────────────

  /** @internal */
  private readonly messageListRef =
    viewChild<ElementRef<HTMLDivElement>>("messageList");

  /** @internal */
  private readonly composerInputRef =
    viewChild<ElementRef<HTMLTextAreaElement>>("composerInput");

  // ── Internal state ────────────────────────────────────────────────

  /** @internal — current text in the composer. */
  protected readonly composerValue = signal("");

  // ── Icons ─────────────────────────────────────────────────────────

  /** @internal */
  protected readonly sendIcon = UIIcons.Lucide.Communication.SendHorizontal;

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — messages grouped by date. */
  protected readonly groupedMessages = computed<readonly MessageDateGroup<M>[]>(
    () => this.groupByDate(this.messages()),
  );

  /** @internal — whether the send button should be enabled. */
  protected readonly canSend = computed(
    () => this.composerValue().trim().length > 0,
  );

  // ── Constructor ───────────────────────────────────────────────────

  public constructor() {
    // Auto-scroll to bottom when messages change
    effect(() => {
      this.messages(); // track
      this.scrollToBottom();
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────

  public ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  // ── Public methods ────────────────────────────────────────────────

  /** Scroll the message list to the bottom. */
  public scrollToBottom(): void {
    requestAnimationFrame(() => {
      const el = this.messageListRef()?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — determine if a message was sent by the current user. */
  protected isMine(message: ChatMessage<M>): boolean {
    return message.sender.id === this.currentUser().id;
  }

  /** @internal — send the composed message. */
  protected send(): void {
    const content = this.composerValue().trim();
    if (!content) return;

    this.messageSend.emit({ content });
    this.composerValue.set("");

    // Re-focus the plain-text composer
    const textarea = this.composerInputRef()?.nativeElement;
    if (textarea) {
      textarea.focus();
    }
  }

  /** @internal — handle Enter key in the text composer. */
  protected onComposerKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  /** @internal — handle input events on the textarea. */
  protected onComposerInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.composerValue.set(target.value);
  }

  // ── Private methods ───────────────────────────────────────────────

  /** Group messages by date, producing human-readable labels. */
  private groupByDate(
    messages: readonly ChatMessage<M>[],
  ): MessageDateGroup<M>[] {
    const groups = new Map<string, ChatMessage<M>[]>();

    for (const msg of messages) {
      const key = this.toDateKey(msg.timestamp);
      const list = groups.get(key);
      if (list) {
        list.push(msg);
      } else {
        groups.set(key, [msg]);
      }
    }

    const today = this.toDateKey(new Date());
    const yesterday = this.toDateKey(new Date(Date.now() - 86_400_000));

    const result: MessageDateGroup<M>[] = [];
    for (const [date, msgs] of groups) {
      let label: string;
      if (date === today) {
        label = "Today";
      } else if (date === yesterday) {
        label = "Yesterday";
      } else {
        label = new Date(date).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
      result.push({ date, label, messages: msgs });
    }

    return result;
  }

  /** Convert a Date to a YYYY-MM-DD key. */
  private toDateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
}
