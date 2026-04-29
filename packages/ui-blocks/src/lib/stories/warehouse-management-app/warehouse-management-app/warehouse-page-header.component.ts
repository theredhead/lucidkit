import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIBadge, UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-warehouse-page-header",
  standalone: true,
  imports: [UIBadge, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./warehouse-page-header.component.html",
  styleUrl: "./warehouse-page-header.component.scss",
})
export class UIWarehousePageHeader {
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
