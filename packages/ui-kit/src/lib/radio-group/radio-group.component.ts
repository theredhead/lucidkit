import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  model,
  output,
} from "@angular/core";

import { UIRadioButton } from "./radio-button.component";
import { UISurface } from "@theredhead/lucid-foundation";

/** Option definition for data-driven radio groups. */
export interface RadioOption {

  /** Human-readable label. */
  label: string;

  /** The value submitted when this option is chosen. */
  value: string;
}

/**
 * A radio group container that manages a single-selection model
 * across its projected `<ui-radio-button>` children.
 *
 * @example
 * ```html
 * <ui-radio-group [(value)]="color" name="color">
 *   <ui-radio-button value="red">Red</ui-radio-button>
 *   <ui-radio-button value="green">Green</ui-radio-button>
 *   <ui-radio-button value="blue">Blue</ui-radio-button>
 * </ui-radio-group>
 * ```
 */
@Component({
  selector: "ui-radio-group",
  standalone: true,
  imports: [UIRadioButton],
  templateUrl: "./radio-group.component.html",
  styleUrl: "./radio-group.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-radio-group",
    role: "radiogroup",
    "[class.disabled]": "disabled()",
    "[attr.aria-label]": "ariaLabel()",
  },
})
export class UIRadioGroup {

  /** The name attribute shared by all radio buttons in this group. */
  public readonly name = input.required<string>();

  /** The currently selected value. Supports two-way binding. */
  public readonly value = model<unknown>(undefined);

  /**
   * Data-driven options. When provided, radio buttons are rendered
   * automatically. Use this instead of projecting `<ui-radio-button>`
   * children when options come from data (e.g. form schemas).
   */
  public readonly options = input<readonly RadioOption[]>([]);

  /** Whether the entire group is disabled. */
  public readonly disabled = input(false);

  /** Accessible label for the radio group. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Emitted when the selected value changes. */
  public readonly valueChange = output<unknown>();

  /** @internal — projected radio button children. */
  public readonly buttons = contentChildren(UIRadioButton);

  /** @internal — called by child radio buttons when selected. */
  public select(buttonValue: unknown): void {
    if (this.disabled()) {
      return;
    }
    this.value.set(buttonValue);
    this.valueChange.emit(buttonValue);
  }
}
