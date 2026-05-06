import { UIEmojiPicker } from "../../emoji-picker.component";
import type { EmojiCategory } from "../../emoji-picker.types";

import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  selector: "ui-custom-categories-story-demo",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIEmojiPicker],
  templateUrl: "./custom-categories.story.html",
  styleUrl: "./custom-categories.story.scss",
})
export class CustomCategoriesStorySource {
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
