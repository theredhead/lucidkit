import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICard, UICardBody, UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-video-sharing-stat-card",
  standalone: true,
  imports: [UICard, UICardBody, UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./video-sharing-stat-card.component.html",
  styleUrl: "./video-sharing-stat-card.component.scss",
})
export class UIVideoSharingStatCard {
  /**
   * The stat label.
   */
  public readonly label = input.required<string>();

  /**
   * The stat value.
   */
  public readonly value = input.required<string | number>();

  /**
   * The progress value shown below the stat.
   */
  public readonly progress = input.required<number>();

  /**
   * The progress accessibility label.
   */
  public readonly ariaLabel = input.required<string>();

  /**
   * Whether to render the value in the compact size.
   */
  public readonly compactValue = input(false);
}
