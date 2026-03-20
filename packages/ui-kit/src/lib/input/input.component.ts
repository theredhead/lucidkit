import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

/**
 * Thin wrapper around a native `<input>` or `<textarea>` element.
 *
 * Supports two-way binding via {@link value} (`[(value)]`).
 * Set {@link multiline} to `true` to render a `<textarea>` instead.
 *
 * @example
 * ```html
 * <ui-input type="number" [(value)]="amount" placeholder="Enter amount" />
 * <ui-input multiline [rows]="4" [(value)]="description" />
 * ```
 */
@Component({
  selector: "ui-input",
  standalone: true,
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-input",
    "[class.ui-input--multiline]": "multiline()",
  },
})
export class UIInput {
  /** Native input type (ignored when {@link multiline} is `true`). */
  readonly type = input<
    "text" | "number" | "date" | "email" | "password" | "tel" | "url"
  >("text");

  /** Current value (two-way bindable). */
  readonly value = model("");

  /** Placeholder text. */
  readonly placeholder = input("");

  /** Whether the control is disabled. */
  readonly disabled = input(false);

  /**
   * When `true`, renders a `<textarea>` instead of an `<input>`.
   */
  readonly multiline = input(false);

  /**
   * Number of visible text rows (only applies when {@link multiline}
   * is `true`). Defaults to `3`.
   */
  readonly rows = input(3);

  /**
   * Accessible label forwarded to the native element as `aria-label`.
   *
   * Required when no visible `<label>` is associated with the control.
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** @internal */
  protected onInput(event: Event): void {
    this.value.set(
      (event.target as HTMLInputElement | HTMLTextAreaElement).value,
    );
  }
}
