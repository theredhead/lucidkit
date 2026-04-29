import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIBadge, UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-page-header",
  standalone: true,
  imports: [UIBadge, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-page-header.component.html",
  styleUrl: "./recipe-book-page-header.component.scss",
})
export class UIRecipeBookPageHeader {
  /**
   * The header icon SVG content.
   */
  public readonly icon = input.required<string>();

  /**
   * The page title.
   */
  public readonly title = input.required<string>();

  /**
   * Optional badge count shown beside the title.
   */
  public readonly badgeCount = input<number | null>(null);
}
