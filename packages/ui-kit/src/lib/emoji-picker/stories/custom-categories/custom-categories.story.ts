import { UIEmojiPicker } from "../../emoji-picker.component";
import type { EmojiCategory } from "../../emoji-picker.types";

import { ChangeDetectionStrategy, Component, signal, input } from "@angular/core";

@Component({
  selector: "ui-custom-categories-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIEmojiPicker],
  templateUrl: "./custom-categories.story.html",
  styleUrl: "./custom-categories.story.scss",
})
export class CustomCategoriesStorySource {

  /**
   * Storybook control forwarded to the emoji-picker example.
   */
  public readonly searchPlaceholder = input<ReturnType<UIEmojiPicker["searchPlaceholder"]>>("Search emoji…");

  /**
   * Storybook control forwarded to the emoji-picker example.
   */
  public readonly previewSize = input<ReturnType<UIEmojiPicker["previewSize"]>>(64);

  /**
   * Storybook control forwarded to the emoji-picker example.
   */
  public readonly ariaLabel = input<ReturnType<UIEmojiPicker["ariaLabel"]>>("Emoji picker");

  protected readonly customCategories: readonly EmojiCategory[] = [
    {
      name: "Smileys",
      emojis: [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😃",
        "😄",
        "😅",
        "😆",
        "😉",
        "😊",
        "😋",
        "😎",
        "😍",
        "🥰",
        "😘",
      ],
    },
    {
      name: "Animals",
      emojis: [
        "🐶",
        "🐱",
        "🐭",
        "🐹",
        "🐰",
        "🦊",
        "🐻",
        "🐼",
        "🐨",
        "🐯",
        "🦁",
        "🐮",
        "🐷",
        "🐸",
        "🐵",
      ],
    },
    {
      name: "Food",
      emojis: [
        "🍎",
        "🍊",
        "🍋",
        "🍇",
        "🍓",
        "🫐",
        "🍈",
        "🍒",
        "🍑",
        "🥭",
        "🍍",
        "🥥",
        "🥝",
        "🍅",
        "🫒",
      ],
    },
    {
      name: "Travel",
      emojis: [
        "🚀",
        "✈️",
        "🚂",
        "🚢",
        "🚁",
        "🛸",
        "🚲",
        "🏍️",
        "🚗",
        "🏕️",
        "🗺️",
        "🌍",
        "🌋",
        "🏝️",
        "🗼",
      ],
    },
  ];

  protected readonly lastEmoji = signal<string | undefined>(undefined);

  protected onEmoji(emoji: string): void {
    this.lastEmoji.set(emoji);
  }
}
