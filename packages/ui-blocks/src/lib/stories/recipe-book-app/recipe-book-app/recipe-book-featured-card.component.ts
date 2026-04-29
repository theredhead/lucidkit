import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  UIAvatar,
  UIBadge,
  UICard,
  UICardBody,
  UICardFooter,
  UIChip,
  UIIcon,
} from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-featured-card",
  standalone: true,
  imports: [
    UIAvatar,
    UIBadge,
    UICard,
    UICardBody,
    UICardFooter,
    UIChip,
    UIIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-featured-card.component.html",
  styleUrl: "./recipe-book-featured-card.component.scss",
})
export class UIRecipeBookFeaturedCard {
  /**
   * The category icon SVG content.
   */
  public readonly icon = input.required<string>();

  /**
   * The recipe title.
   */
  public readonly title = input.required<string>();

  /**
   * The formatted total time.
   */
  public readonly time = input.required<string>();

  /**
   * The time icon SVG content.
   */
  public readonly timeIcon = input.required<string>();

  /**
   * The serving count.
   */
  public readonly servings = input.required<number>();

  /**
   * The servings icon SVG content.
   */
  public readonly servingsIcon = input.required<string>();

  /**
   * The recipe difficulty label.
   */
  public readonly difficulty = input.required<string>();

  /**
   * The difficulty badge color.
   */
  public readonly difficultyColor = input.required<string>();

  /**
   * The rendered rating stars.
   */
  public readonly rating = input.required<string>();

  /**
   * The review count.
   */
  public readonly reviews = input.required<number>();

  /**
   * The tag list.
   */
  public readonly tags = input<readonly string[]>([]);

  /**
   * The author name.
   */
  public readonly author = input.required<string>();
}
