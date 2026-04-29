import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIProgress } from "@theredhead/lucid-kit";

@Component({
  selector: "ui-warehouse-progress-row",
  standalone: true,
  imports: [UIProgress],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./warehouse-progress-row.component.html",
  styleUrl: "./warehouse-progress-row.component.scss",
})
export class UIWarehouseProgressRow {
  /**
   * The row label.
   */
  public readonly label = input.required<string>();

  /**
   * The progress value.
   */
  public readonly progress = input.required<number>();

  /**
   * The accessible progress label.
   */
  public readonly ariaLabel = input.required<string>();

  /**
   * The trailing value text.
   */
  public readonly value = input.required<string>();

  /**
   * Optional minimum width for the leading label.
   */
  public readonly labelMinWidth = input<string | null>(null);

  /**
   * Optional top margin.
   */
  public readonly marginTop = input<string | null>(null);
}
