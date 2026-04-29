import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICard, UICardBody, UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-user-management-stat-card",
  standalone: true,
  imports: [UICard, UICardBody, UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./user-management-stat-card.component.html",
  styleUrl: "./user-management-stat-card.component.scss",
})
export class UIUserManagementStatCard {
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
