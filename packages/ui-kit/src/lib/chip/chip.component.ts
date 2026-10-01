import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { getContrastingTextColor, UISurface } from "@theredhead/lucid-foundation";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";

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
  imports: [UIIcon],
  templateUrl: "./chip.component.html",
  styleUrl: "./chip.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-chip",
    "[class.primary]": "color() === 'primary'",
    "[class.success]": "color() === 'success'",
    "[class.warning]": "color() === 'warning'",
    "[class.danger]": "color() === 'danger'",
    "[class.neutral]": "color() === 'neutral'",
    "[class.muted]": "muted()",
    "[class.disabled]": "disabled()",
    "[class.selected]": "selected()",
    "[style.background-color]": "backgroundColor()",
    "[style.color]": "resolvedTextColor()",
  },
})
export class UIChip {

  /** @internal Shared close icon used by removable chips. */
  protected readonly closeIcon = UIIcons.Lucide.Math.X;

  /** Color preset. */
  public readonly color = input<ChipColor>("neutral");

  /** Use a softer surface treatment instead of a filled semantic colour. */
  public readonly muted = input(false);

  /** Whether the chip represents an active or selected item. */
  public readonly selected = input(false);

  /** Optional per-instance background color override. */
  public readonly backgroundColor = input<string | null>(null);

  /** Optional per-instance text color override. */
  public readonly textColor = input<string | null>(null);

  /** Resolve readable text for arbitrary background color overrides. */
  protected readonly resolvedTextColor = computed(() => {
    const explicit = this.textColor();
    if (explicit) return explicit;
    const background = this.backgroundColor();
    return background ? getContrastingTextColor(background) : null;
  });

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
