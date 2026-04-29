import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIBadge, UICard, UICardBody, UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-summary-card",
  standalone: true,
  imports: [UIBadge, UICard, UICardBody, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-summary-card.component.html",
  styleUrl: "./recipe-book-summary-card.component.scss",
})
export class UIRecipeBookSummaryCard {
  /**
   * The card title.
   */
  public readonly title = input.required<string>();

  /**
   * The badge label text.
   */
  public readonly badgeText = input.required<string>();

  /**
   * The badge color.
   */
  public readonly badgeColor = input.required<
    "success" | "warning" | "danger" | "neutral"
  >();

  /**
   * The first meta icon.
   */
  public readonly metaOneIcon = input.required<string>();

  /**
   * The first meta text.
   */
  public readonly metaOneText = input.required<string>();

  /**
   * The second meta icon.
   */
  public readonly metaTwoIcon = input.required<string>();

  /**
   * The second meta text.
   */
  public readonly metaTwoText = input.required<string>();

  /**
   * The third meta icon.
   */
  public readonly metaThreeIcon = input.required<string>();

  /**
   * The third meta text.
   */
  public readonly metaThreeText = input.required<string>();
}
