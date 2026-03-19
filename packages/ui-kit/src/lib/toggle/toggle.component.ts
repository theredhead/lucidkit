import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

/** Size variant for the toggle switch. */
export type ToggleSize = "sm" | "md" | "lg";

/**
 * A toggle switch with customisable on/off labels.
 *
 * Provides a two-way `value` binding and optional text labels that
 * appear beside (or inside) the switch track, giving users clear
 * feedback about what each state represents.
 *
 * @example
 * ```html
 * <!-- Simple on/off toggle -->
 * <ui-toggle [(value)]="isEnabled" />
 *
 * <!-- With custom labels -->
 * <ui-toggle [(value)]="mode"
 *   onLabel="Dark" offLabel="Light" />
 *
 * <!-- With projected label -->
 * <ui-toggle [(value)]="notifications">
 *   Enable notifications
 * </ui-toggle>
 * ```
 */
@Component({
  selector: "ui-toggle",
  standalone: true,
  templateUrl: "./toggle.component.html",
  styleUrl: "./toggle.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-toggle",
    "[class.ui-toggle--on]": "value()",
    "[class.ui-toggle--disabled]": "disabled()",
    "[class.ui-toggle--sm]": "size() === 'sm'",
    "[class.ui-toggle--md]": "size() === 'md'",
    "[class.ui-toggle--lg]": "size() === 'lg'",
    "[class.ui-toggle--labelled]": "hasTrackLabels()",
  },
})
export class UIToggle {
  /** Whether the toggle is on. Supports two-way binding via `[(value)]`. */
  public readonly value = model(false);

  /** Label displayed when the toggle is **on**. */
  public readonly onLabel = input<string>("");

  /** Label displayed when the toggle is **off**. */
  public readonly offLabel = input<string>("");

  /** Whether the toggle is disabled. */
  public readonly disabled = input(false);

  /** Size variant. */
  public readonly size = input<ToggleSize>("md");

  /** Accessible label forwarded to `aria-label`. */
  public readonly ariaLabel = input<string>("");

  /** Emitted when the value changes. */
  public readonly valueChange = output<boolean>();

  /** Whether on/off track labels are configured. */
  protected readonly hasTrackLabels = computed(
    () => this.onLabel() !== "" || this.offLabel() !== "",
  );

  /** The currently active label text. */
  protected readonly activeLabel = computed(() =>
    this.value() ? this.onLabel() : this.offLabel(),
  );

  /** Toggle the value on user interaction. */
  public toggle(): void {
    if (this.disabled()) {
      return;
    }
    const next = !this.value();
    this.value.set(next);
    this.valueChange.emit(next);
  }

  /** @internal Handle keyboard activation. */
  protected onKeyDown(event: KeyboardEvent): void {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.toggle();
    }
  }
}
