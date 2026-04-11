import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";
import { UISurface } from "@theredhead/foundation";

/** Visual appearance of the checkbox control. */
export type CheckboxVariant = "checkbox" | "switch";

/**
 * A checkbox / toggle-switch control.
 *
 * Supports two visual variants: a traditional checkbox and a
 * toggle-switch. Both share the same API surface.
 *
 * Content is projected as the label text.
 *
 * @example
 * ```html
 * <ui-checkbox [(checked)]="isEnabled">Enable feature</ui-checkbox>
 * <ui-checkbox variant="switch" [(checked)]="darkMode">Dark mode</ui-checkbox>
 * ```
 */
@Component({
  selector: "ui-checkbox",
  standalone: true,
  templateUrl: "./checkbox.component.html",
  styleUrl: "./checkbox.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: {
    class: "ui-checkbox",
    "[class.checkbox]": "variant() === 'checkbox'",
    "[class.switch]": "variant() === 'switch'",
    "[class.checked]": "checked()",
    "[class.disabled]": "disabled()",
    "[class.indeterminate]": "indeterminate()",
  },
})
export class UICheckbox {
  /** Visual variant: traditional checkbox or toggle switch. */
  public readonly variant = input<CheckboxVariant>("checkbox");

  /** Whether the checkbox is checked. Supports two-way binding. */
  public readonly checked = model(false);

  /** Whether the control is disabled. */
  public readonly disabled = input(false);

  /**
   * Whether the checkbox is in an indeterminate state.
   * Only applies to the `checkbox` variant. Visually indicates
   * a "partially selected" state (e.g. in a select-all scenario).
   */
  public readonly indeterminate = input(false);

  /** Accessible label for the control. */
  public readonly ariaLabel = input<string | undefined>(undefined);

  /** Emitted when the checked state changes. */
  public readonly checkedChange = output<boolean>();

  /** The ARIA role for the control. */
  protected readonly role = computed(() =>
    this.variant() === "switch" ? "switch" : "checkbox",
  );

  /** The ARIA checked state accounting for indeterminate. */
  protected readonly ariaChecked = computed(() => {
    if (this.variant() === "checkbox" && this.indeterminate()) {
      return "mixed";
    }
    return this.checked();
  });

  /** Toggle the checked state on user interaction. */
  public toggle(): void {
    if (this.disabled()) {
      return;
    }
    const next = !this.checked();
    this.checked.set(next);
    this.checkedChange.emit(next);
  }

  /** Handle keyboard interaction. */
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.toggle();
    }
  }
}
