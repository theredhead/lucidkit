import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIAvatar, UIChip, UIIcon } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-warehouse-detail-header",
  standalone: true,
  imports: [UIAvatar, UIChip, UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./warehouse-detail-header.component.html",
  styleUrl: "./warehouse-detail-header.component.scss",
})
export class UIWarehouseDetailHeader {
  /**
   * The header icon SVG content.
   */
  public readonly icon = input<string | null>(null);

  /**
   * Optional avatar name rendered instead of an icon.
   */
  public readonly avatarName = input<string | null>(null);

  /**
   * The avatar size when avatarName is provided.
   */
  public readonly avatarSize = input<"small" | "medium" | "large">("medium");

  /**
   * The detail title.
   */
  public readonly title = input.required<string>();

  /**
   * The supporting subtitle.
   */
  public readonly subtitle = input.required<string>();

  /**
   * Optional status label shown on the right.
   */
  public readonly status = input<string | null>(null);

  /**
   * Optional status chip color.
   */
  public readonly statusColor = input<string>("neutral");
}
