import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

/**
 * Thin wrapper around a native `<input>` element.
 *
 * Supports two-way binding via {@link value} (`[(value)]`).
 *
 * @example
 * ```html
 * <ui-input type="number" [(value)]="amount" placeholder="Enter amount" />
 * ```
 */
@Component({
  selector: "ui-input",
  standalone: true,
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-input" },
})
export class UIInput {
  /** Native input type. */
  readonly type = input<"text" | "number" | "date">("text");

  /** Current value (two-way bindable). */
  readonly value = model("");

  /** Placeholder text. */
  readonly placeholder = input("");

  /** Whether the control is disabled. */
  readonly disabled = input(false);

  /**
   * Accessible label forwarded to the native `<input>` as `aria-label`.
   *
   * Required when no visible `<label>` is associated with the control.
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal */
  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
