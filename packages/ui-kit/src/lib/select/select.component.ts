import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

/** A single option rendered inside a {@link UISelect}. */
export interface SelectOption {
  /** The value submitted when this option is chosen. */
  value: string;
  /** Human-readable label displayed in the dropdown. */
  label: string;
}

/**
 * Thin wrapper around a native `<select>` element.
 *
 * Supports two-way binding via {@link value} (`[(value)]`).
 *
 * @example
 * ```html
 * <ui-select [options]="options" [(value)]="selected" />
 * ```
 */
@Component({
  selector: "ui-select",
  standalone: true,
  templateUrl: "./select.component.html",
  styleUrl: "./select.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-select" },
})
export class UISelect {
  /** Available options. */
  readonly options = input.required<SelectOption[]>();

  /** Currently selected value (two-way bindable). */
  readonly value = model("");

  /** Whether the control is disabled. */
  readonly disabled = input(false);

  /**
   * Accessible label forwarded to the native `<select>` as `aria-label`.
   *
   * Required when no visible `<label>` is associated with the control.
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal */
  protected onSelectionChange(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value);
  }
}
