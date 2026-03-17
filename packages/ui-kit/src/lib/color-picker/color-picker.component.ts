import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  model,
  output,
} from "@angular/core";

import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { PopoverService } from "../popover/popover.service";
import type { ColorPickerMode } from "./color-picker.types";
import { UIColorPickerPopover } from "./color-picker-popover.component";

/**
 * A colour-picker trigger button.
 *
 * Displays a small colour swatch showing the current value.
 * Clicking the button opens a popover with four mode tabs:
 *
 * 1. **Theme** — material-style palette rows in tonal luminosities
 * 2. **Grid** — 72-colour flat grid covering the full spectrum
 * 3. **RGBA** — red / green / blue / alpha sliders
 * 4. **HSLA** — hue / saturation / lightness / alpha sliders
 *
 * The selected colour is emitted as a hex string (`#rrggbb` or
 * `#rrggbbaa` when alpha < 1).
 *
 * @example
 * ```html
 * <ui-color-picker [(value)]="color" ariaLabel="Pick a colour" />
 * ```
 */
@Component({
  selector: "ui-color-picker",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-color-picker",
    "[class.ui-color-picker--disabled]": "disabled()",
  },
  templateUrl: "./color-picker.component.html",
  styleUrl: "./color-picker.component.scss",
})
export class UIColorPicker {
  // ── Inputs / Outputs / Models ───────────────────────────────

  /** The current colour as a hex string (`#rrggbb` or `#rrggbbaa`). */
  public readonly value = model<string>("#0061a4");

  /** Which mode tab the popover opens to. */
  public readonly initialMode = input<ColorPickerMode>("theme");

  /** Whether the trigger button is disabled. */
  public readonly disabled = input(false);

  /** Accessible label for the trigger button. */
  public readonly ariaLabel = input("Pick a colour");

  /** Emitted after the user confirms a colour from the popover. */
  public readonly colorChange = output<string>();

  // ── Private fields ──────────────────────────────────────────

  /** @internal */
  public readonly paletteIcon = UIIcons.Lucide.Design.Palette;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly popoverService = inject(PopoverService);

  // ── Public methods ──────────────────────────────────────────

  /** Opens the colour-picker popover anchored to this button. */
  public open(): void {
    if (this.disabled()) return;

    const ref = this.popoverService.openPopover<UIColorPickerPopover>({
      component: UIColorPickerPopover,
      anchor: this.el.nativeElement,
      verticalAxisAlignment: "bottom",
      horizontalAxisAlignment: "auto",
      verticalOffset: 4,
      ariaLabel: "Colour picker",
      inputs: {
        initialValue: this.value(),
        initialMode: this.initialMode(),
      },
    });

    ref.closed.subscribe((result) => {
      if (result) {
        this.value.set(result as string);
        this.colorChange.emit(result as string);
      }
    });
  }
}
