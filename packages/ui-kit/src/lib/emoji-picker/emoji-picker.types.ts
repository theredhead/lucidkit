/**
 * A categorised set of emoji for the picker component.
 *
 * @example
 * ```ts
 * const foods: EmojiCategory = {
 *   name: 'Food & Drink',
 *   emojis: ['🍎', '🍕', '🍺', '☕'],
 * };
 * ```
 */
export interface EmojiCategory {
  /** Display name for the category tab/header. */
  readonly name: string;

  /** Array of emoji characters in this category. */
  readonly emojis: readonly string[];
}
