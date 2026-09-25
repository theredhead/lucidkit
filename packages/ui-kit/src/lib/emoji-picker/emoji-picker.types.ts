/** Language-specific semantic terms keyed by emoji character. */
export type EmojiSearchTerms = Readonly<Record<string, readonly string[]>>;

/**
 * A categorised set of emoji for the picker component.
 *
 * Search terms are language-specific metadata. Consumers should provide terms
 * for the active UI language through the `emojiSearchTerms` input.
 */
export interface EmojiCategory {

  /** Display name for the category tab/header. */
  readonly name: string;

  /** Array of emoji characters in this category. */
  readonly emojis: readonly string[];

  /** Optional searchable terms keyed by emoji character. */
  readonly searchTerms?: EmojiSearchTerms;
}
