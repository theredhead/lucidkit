import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";

import { UIRadioGroup } from "./radio-group.component";
import { UISurface } from '@theredhead/foundation';

/**
 * A single radio button within a `<ui-radio-group>`.
 *
 * @example
 * ```html
 * <ui-radio-button value="option1">Option 1</ui-radio-button>
 * ```
 */
@Component({
  selector: "ui-radio-button",
  standalone: true,
  templateUrl: "./radio-button.component.html",
  styleUrl: "./radio-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-radio-button",
    "[class.checked]": "isChecked()",
    "[class.disabled]": "isDisabled()",
  },
})
export class UIRadioButton {
  /** The value this radio button represents. */
  public readonly value = input.required<unknown>();

  /** Whether this individual radio button is disabled. */
  public readonly disabled = input(false);

  /** Accessible label override. Normally label is projected content. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal */
  private readonly group = inject(UIRadioGroup);

  /** Whether this button is currently selected. */
  public readonly isChecked = computed(
    () => this.group.value() === this.value(),
  );

  /** Whether this button is disabled (own or group-level). */
  public readonly isDisabled = computed(
    () => this.disabled() || this.group.disabled(),
  );

  /** @internal — Handle selection. */
  protected select(): void {
    if (this.isDisabled()) {
      return;
    }
    this.group.select(this.value());
  }

  /** @internal — Handle keyboard interaction. */
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.select();
    }
  }
}
