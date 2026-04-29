import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UICard, UICardBody, UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-quick-tour-metric-card",
  standalone: true,
  imports: [UICard, UICardBody, UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./quick-tour-metric-card.component.html",
  styleUrl: "./quick-tour-metric-card.component.scss",
})
export class UIQuickTourMetricCard {
  /**
   * The metric label.
   */
  public readonly label = input.required<string>();

  /**
   * The metric value.
   */
  public readonly value = input.required<number>();
}
