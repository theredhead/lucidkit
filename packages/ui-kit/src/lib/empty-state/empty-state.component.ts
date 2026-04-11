import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { UIIcon } from "../icon/icon.component";

/**
 * A zero-data placeholder with heading, optional message, optional icon,
 * and a projected action slot.
 *
 * Use inside lists, tables, or panels when there is nothing to show.
 *
 * @example
 * ```html
 * <ui-empty-state
 *   heading="No results found"
 *   message="Try adjusting your filters or search query."
 * >
 *   <button action>Clear filters</button>
 * </ui-empty-state>
 * ```
 */
@Component({
  selector: "ui-empty-state",
  standalone: true,
  imports: [UIIcon],
  templateUrl: "./empty-state.component.html",
  styleUrl: "./empty-state.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-empty-state",
    role: "status",
  },
})
export class UIEmptyState {
  /** Primary heading text. */
  public readonly heading = input.required<string>();

  /** Optional explanatory message below the heading. */
  public readonly message = input<string>("");

  /**
   * Optional SVG inner-content string for the illustration icon.
   * Uses the same format as `UIIcon [svg]`.
   */
  public readonly icon = input<string>("");

  /** Size (px) of the icon when provided. */
  public readonly iconSize = input<number>(48);

  /** Accessible label for the region. */
  public readonly ariaLabel = input<string>("Empty state");
}
