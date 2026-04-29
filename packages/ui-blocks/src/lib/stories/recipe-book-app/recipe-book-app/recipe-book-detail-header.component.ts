import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIAvatar } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-recipe-book-detail-header",
  standalone: true,
  imports: [UIAvatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./recipe-book-detail-header.component.html",
  styleUrl: "./recipe-book-detail-header.component.scss",
})
export class UIRecipeBookDetailHeader {
  /**
   * The avatar label shown at the start of the header.
   */
  public readonly avatarName = input.required<string>();

  /**
   * The detail title.
   */
  public readonly title = input.required<string>();

  /**
   * The supporting subtitle.
   */
  public readonly subtitle = input.required<string>();
}
