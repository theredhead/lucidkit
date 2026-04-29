import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import {
  UIBadge,
  UICard,
  UICardBody,
  UICardHeader,
  UIChip,
  UIIcon,
  UIProgress,
} from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-ingredient-match-card",
  standalone: true,
  imports: [
    UIBadge,
    UICard,
    UICardBody,
    UICardHeader,
    UIChip,
    UIIcon,
    UIProgress,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-ingredient-match-card.component.html",
  styleUrl: "./recipe-book-ingredient-match-card.component.scss",
})
export class UIRecipeBookIngredientMatchCard {
  /**
   * The recipe title.
   */
  public readonly title = input.required<string>();

  /**
   * The percentage match score.
   */
  public readonly matchPercent = input.required<number>();

  /**
   * The badge color for the match score.
   */
  public readonly matchColor = input.required<
    "success" | "warning" | "neutral"
  >();

  /**
   * Progress value for the match bar.
   */
  public readonly progress = input.required<number>();

  /**
   * Time icon SVG content.
   */
  public readonly timeIcon = input.required<string>();

  /**
   * Display time for the recipe.
   */
  public readonly time = input.required<string>();

  /**
   * Rating icon SVG content.
   */
  public readonly ratingIcon = input.required<string>();

  /**
   * Numeric rating display.
   */
  public readonly rating = input.required<number>();

  /**
   * Number of matched ingredients.
   */
  public readonly matchedCount = input.required<number>();

  /**
   * Total ingredient count.
   */
  public readonly totalIngredients = input.required<number>();

  /**
   * Ingredient names shown as chips.
   */
  public readonly ingredients = input.required<readonly string[]>();

  /**
   * Currently selected ingredient names.
   */
  public readonly selectedIngredients = input.required<readonly string[]>();

  protected isSelectedIngredient(name: string): boolean {
    return this.selectedIngredients().includes(name);
  }
}
