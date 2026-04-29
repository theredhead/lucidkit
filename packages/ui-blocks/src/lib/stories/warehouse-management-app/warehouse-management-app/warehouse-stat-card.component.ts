import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICard, UICardBody, UIIcon, UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-warehouse-stat-card",
  standalone: true,
  imports: [UICard, UICardBody, UIIcon, UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./warehouse-stat-card.component.html",
  styleUrl: "./warehouse-stat-card.component.scss",
})
export class UIWarehouseStatCard {
  /**
   * The stat icon SVG content.
   */
  public readonly icon = input.required<string>();

  /**
   * The stat label.
   */
  public readonly label = input.required<string>();

  /**
   * The stat value.
   */
  public readonly value = input.required<number>();

  /**
   * The progress value shown below the stat.
   */
  public readonly progress = input.required<number>();

  /**
   * The progress accessibility label.
   */
  public readonly ariaLabel = input.required<string>();
}
