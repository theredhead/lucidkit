import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export type ButtonVariant = "filled" | "outlined" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Thin wrapper around a native `<button>` element.
 *
 * Content is projected via `<ng-content>`, and native `(click)`
 * events bubble up naturally — no custom output needed.
 *
 * @example
 * ```html
 * <ui-button variant="outlined" size="sm" (click)="save()">
 *   Save
 * </ui-button>
 * ```
 */
@Component({
  selector: "ui-button",
  standalone: true,
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-button",
    "[class.ui-button--filled]": "variant() === 'filled'",
    "[class.ui-button--outlined]": "variant() === 'outlined'",
    "[class.ui-button--ghost]": "variant() === 'ghost'",
    "[class.ui-button--sm]": "size() === 'sm'",
    "[class.ui-button--md]": "size() === 'md'",
    "[class.ui-button--lg]": "size() === 'lg'",
  },
})
export class UIButton {
  /** Native button type attribute. */
  readonly type = input<"button" | "submit" | "reset">("button");

  /** Visual style variant. */
  readonly variant = input<ButtonVariant>("filled");

  /** Size preset. */
  readonly size = input<ButtonSize>("md");

  /** Whether the button is disabled. */
  readonly disabled = input(false);

  /**
   * Accessible label forwarded to the native `<button>` as `aria-label`.
   *
   * Use this when the button has no visible text content
   * (e.g. icon-only buttons like a close/remove button).
   */
  readonly ariaLabel = input<string | undefined>(undefined);
}
