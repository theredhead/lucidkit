/** Visual style of a chat message. */
export type ChatMessageType = "text" | "rich-text" | "system";

/** Mode for the message composer. */
export type ChatComposerMode = "text" | "rich-text";

/**
 * A chat participant (user, bot, or system).
 */
export interface ChatParticipant {
  /** Unique identifier for this participant. */
  readonly id: string;

  /** Display name. */
  readonly name: string;

  /** Optional avatar image URL. */
  readonly avatarSrc?: string;

  /** Optional email for Gravatar lookup. */
  readonly avatarEmail?: string;
}

/**
 * A single chat message.
 *
 * @typeParam M — Extra metadata attached to each message.
 */
export interface ChatMessage<M = unknown> {
  /** Unique message identifier. */
  readonly id: string;

  /** Message content (plain text or HTML depending on {@link type}). */
  readonly content: string;

  /** When the message was sent. */
  readonly timestamp: Date;

  /** Who sent the message. */
  readonly sender: ChatParticipant;

  /** Content interpretation. Defaults to `'text'`. */
  readonly type?: ChatMessageType;

  /** Optional metadata. */
  readonly meta?: M;
}

/**
 * Emitted when the user sends a message via the composer.
 */
export interface MessageSendEvent {
  /** The composed message content. */
  readonly content: string;
}

/**
 * A group of messages under a date label.
 * @internal
 */
export interface MessageDateGroup<M = unknown> {
  /** ISO date string key. */
  readonly date: string;

  /** Human-readable label (e.g. "Today", "Yesterday", or a date). */
  readonly label: string;

  /** Messages in chronological order. */
  readonly messages: readonly ChatMessage<M>[];
}

/**
 * Template context for custom message rendering via
 * `#messageTemplate`.
 *
 * @typeParam M — Extra metadata type.
 */
export interface MessageTemplateContext<M = unknown> {
  /** The message (also available as `$implicit`). */
  readonly $implicit: ChatMessage<M>;

  /** The message. */
  readonly message: ChatMessage<M>;

  /** Whether this message was sent by the current user. */
  readonly isMine: boolean;
}
