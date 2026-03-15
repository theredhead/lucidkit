import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

/** Color preset for the chip. */
export type ChipColor =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

/**
 * A removable chip / tag indicator.
 *
 * Content is projected as the label. When `removable` is true,
 * a dismiss button is shown and `removed` is emitted on click.
 *
 * @example
 * ```html
 * <ui-chip>Default</ui-chip>
 * <ui-chip color="success" [removable]="true" (removed)="onRemove()">Active</ui-chip>
 * ```
 */
@Component({
  selector: "ui-chip",
  standalone: true,
  templateUrl: "./chip.component.html",
  styleUrl: "./chip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-chip",
    "[class.ui-chip--primary]": "color() === 'primary'",
    "[class.ui-chip--success]": "color() === 'success'",
    "[class.ui-chip--warning]": "color() === 'warning'",
    "[class.ui-chip--danger]": "color() === 'danger'",
    "[class.ui-chip--neutral]": "color() === 'neutral'",
    "[class.ui-chip--disabled]": "disabled()",
  },
})
export class UIChip {
  /** Color preset. */
  public readonly color = input<ChipColor>("neutral");

  /** Whether the chip can be removed (shows dismiss button). */
  public readonly removable = input(false);

  /** Whether the chip is disabled. */
  public readonly disabled = input(false);

  /** Accessible label for the chip. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Emitted when the dismiss button is clicked. */
  public readonly removed = output<void>();

  /** @internal — handle dismiss click. */
  protected onRemove(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.removed.emit();
    }
  }
}
