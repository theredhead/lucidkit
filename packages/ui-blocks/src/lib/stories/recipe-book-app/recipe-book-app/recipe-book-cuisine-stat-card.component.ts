import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICard, UICardBody, UIIcon, UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-cuisine-stat-card",
  standalone: true,
  imports: [UICard, UICardBody, UIIcon, UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-cuisine-stat-card.component.html",
  styleUrl: "./recipe-book-cuisine-stat-card.component.scss",
})
export class UIRecipeBookCuisineStatCard {
  /**
   * The icon shown in the stat header.
   */
  public readonly icon = input.required<string>();

  /**
   * The cuisine name.
   */
  public readonly label = input.required<string>();

  /**
   * The recipe count.
   */
  public readonly value = input.required<number>();

  /**
   * Progress percentage for the cuisine share.
   */
  public readonly progress = input.required<number>();
}
