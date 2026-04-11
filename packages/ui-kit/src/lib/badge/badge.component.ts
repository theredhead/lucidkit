import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { UISurface } from "@theredhead/lucid-foundation";

/** Visual variant of the badge. */
export type BadgeVariant = "count" | "dot" | "label";

/** Color preset for the badge. */
export type BadgeColor =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/**
 * A standalone status indicator / count badge.
 *
 * @example
 * ```html
 * <ui-badge [count]="5" color="danger" />
 * <ui-badge variant="dot" color="success" />
 * <ui-badge variant="label">New</ui-badge>
 * ```
 */
@Component({
  selector: "ui-badge",
  standalone: true,
  templateUrl: "./badge.component.html",
  styleUrl: "./badge.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-badge",
    "[class.count]": "variant() === 'count'",
    "[class.dot]": "variant() === 'dot'",
    "[class.label]": "variant() === 'label'",
    "[class.primary]": "color() === 'primary'",
    "[class.success]": "color() === 'success'",
    "[class.warning]": "color() === 'warning'",
    "[class.danger]": "color() === 'danger'",
    "[class.neutral]": "color() === 'neutral'",
  },
})
export class UIBadge {
  /** Visual variant. */
  public readonly variant = input<BadgeVariant>("count");

  /** Color preset. */
  public readonly color = input<BadgeColor>("primary");

  /**
   * The numeric count to display. Only used when variant is `count`.
   * Values above `maxCount` are shown as `{maxCount}+`.
   */
  public readonly count = input(0);

  /** Maximum count before showing `{max}+`. */
  public readonly maxCount = input(99);

  /** Accessible label for the badge. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** The displayed text for count variant. */
  protected readonly displayCount = computed(() => {
    const c = this.count();
    const max = this.maxCount();
    return c > max ? `${max}+` : `${c}`;
  });
}
