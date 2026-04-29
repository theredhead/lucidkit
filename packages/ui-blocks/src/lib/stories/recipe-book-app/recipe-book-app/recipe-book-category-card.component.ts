import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-category-card",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-category-card.component.html",
  styleUrl: "./recipe-book-category-card.component.scss",
})
export class UIRecipeBookCategoryCard {
  /**
   * The category icon SVG content.
   */
  public readonly icon = input.required<string>();

  /**
   * The category name.
   */
  public readonly name = input.required<string>();

  /**
   * The number of recipes in the category.
   */
  public readonly count = input.required<number>();
}
