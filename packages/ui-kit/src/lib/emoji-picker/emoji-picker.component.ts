import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { DEFAULT_EMOJI_CATEGORIES } from "./emoji-picker.data";
import type { EmojiCategory } from "./emoji-picker.types";
import { UISurface } from '@theredhead/foundation';

/**
 * A categorised, searchable emoji picker.
 *
 * Displays a grid of emoji organised by category with a search
 * input to filter across all categories. Accepts an optional
 * `categories` input to provide a custom set of emoji; defaults
 * to the built-in comprehensive set.
 *
 * @example
 * ```html
 * <ui-emoji-picker (emojiSelected)="onEmoji($event)" />
 *
 * <ui-emoji-picker
 *   [categories]="customCategories"
 *   searchPlaceholder="Find emoji…"
 *   (emojiSelected)="onEmoji($event)"
 * />
 * ```
 */
@Component({
  selector: "ui-emoji-picker",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  templateUrl: "./emoji-picker.component.html",
  styleUrl: "./emoji-picker.component.scss",
  host: {
    class: "ui-emoji-picker",
  },
})
export class UIEmojiPicker {
  // ── Inputs ─────────────────────────────────────────────

  /**
   * Categorised emoji sets to display. Falls back to the
   * built-in comprehensive set when not provided or empty.
   */
  public readonly categories = input<readonly EmojiCategory[]>(
    DEFAULT_EMOJI_CATEGORIES,
  );

  /** Placeholder text for the search input. */
  public readonly searchPlaceholder = input<string>("Search emoji…");

  /** Accessible label for the picker. */
  public readonly ariaLabel = input<string>("Emoji picker");

  /**
   * Size of the hover preview in pixels. Set to `0` to disable
   * the preview entirely.
   *
   * @default 64
   */
  public readonly previewSize = input<number>(64);

  // ── Outputs ────────────────────────────────────────────

  /** Emitted when the user selects an emoji. */
  public readonly emojiSelected = output<string>();

  // ── Internal state ─────────────────────────────────────

  /** Current search query. */
  protected readonly searchTerm = signal("");

  /** Index of the active category tab (null = show all). */
  protected readonly activeCategoryIndex = signal<number | null>(null);

  /** Emoji currently hovered for the preview. */
  protected readonly hoveredEmoji = signal<string | null>(null);

  // ── Computed ───────────────────────────────────────────

  /** Effective categories, falling back to defaults. */
  protected readonly effectiveCategories = computed(() => {
    const cats = this.categories();
    return cats.length > 0 ? cats : DEFAULT_EMOJI_CATEGORIES;
  });

  /**
   * Filtered categories based on search term and active
   * category tab.
   */
  protected readonly filteredCategories = computed(() => {
    const cats = this.effectiveCategories();
    const term = this.searchTerm().toLowerCase().trim();
    const activeIdx = this.activeCategoryIndex();

    // When searching, search across all categories
    if (term) {
      const results: { name: string; emojis: readonly string[] }[] = [];
      for (const cat of cats) {
        const matching = cat.emojis.filter((e) => e.includes(term));
        if (matching.length > 0) {
          results.push({ name: cat.name, emojis: matching });
        }
      }
      return results;
    }

    // When a category tab is active, show only that category
    if (activeIdx != null && activeIdx >= 0 && activeIdx < cats.length) {
      return [cats[activeIdx]];
    }

    return cats;
  });

  /** Icons exposed to the template. */
  protected readonly UIIcons = UIIcons;

  // ── Methods ────────────────────────────────────────────

  /** @internal */
  protected onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    // Reset category filter when searching
    if (input.value.trim()) {
      this.activeCategoryIndex.set(null);
    }
  }

  /** @internal */
  protected selectCategory(index: number | null): void {
    this.activeCategoryIndex.set(index);
    this.searchTerm.set("");
  }

  /** @internal */
  protected selectEmoji(emoji: string): void {
    this.emojiSelected.emit(emoji);
  }

  /** @internal */
  protected onEmojiHover(emoji: string): void {
    if (this.previewSize() > 0) {
      this.hoveredEmoji.set(emoji);
    }
  }

  /** @internal */
  protected onEmojiLeave(): void {
    this.hoveredEmoji.set(null);
  }
}
