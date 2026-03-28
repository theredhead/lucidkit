import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  input,
} from "@angular/core";
import { UI_DEFAULT_SURFACE_TYPE, UISurface } from "@theredhead/foundation";

export type ButtonVariant = "filled" | "outlined" | "ghost";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonColor =
  | "neutral"
  | "primary"
  | "secondary"
  | "safe"
  | "danger";

/** Partial configuration for default button appearance. */
export interface ButtonDefaults {
  readonly variant?: ButtonVariant;
  readonly color?: ButtonColor;
  readonly size?: ButtonSize;
  readonly pill?: boolean;
}

/**
 * Injection token to customise the default appearance of every `UIButton`
 * in a subtree. Provide it at the application or component level:
 *
 * ```ts
 * providers: [
 *   { provide: UI_BUTTON_DEFAULTS, useValue: { variant: 'outlined', color: 'neutral' } },
 * ]
 * ```
 *
 * Individual `<ui-button>` inputs still override these defaults.
 */
export const UI_BUTTON_DEFAULTS = new InjectionToken<ButtonDefaults>(
  "UI_BUTTON_DEFAULTS",
);

/**
 * Thin wrapper around a native `<button>` element.
 *
 * Content is projected via `<ng-content>`, and native `(click)`
 * events bubble up naturally — no custom output needed.
 *
 * @example
 * ```html
 * <ui-button variant="outlined" size="small" (click)="save()">
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
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "button" }],
  host: {
    class: "ui-button",
    "[class.ui-button--filled]": "variant() === 'filled'",
    "[class.ui-button--outlined]": "variant() === 'outlined'",
    "[class.ui-button--ghost]": "variant() === 'ghost'",
    "[class.ui-button--small]": "size() === 'small'",
    "[class.ui-button--medium]": "size() === 'medium'",
    "[class.ui-button--large]": "size() === 'large'",
    "[class.ui-button--neutral]": "color() === 'neutral'",
    "[class.ui-button--primary]": "color() === 'primary'",
    "[class.ui-button--secondary]": "color() === 'secondary'",
    "[class.ui-button--safe]": "color() === 'safe'",
    "[class.ui-button--danger]": "color() === 'danger'",
    "[class.ui-button--pill]": "pill()",
  },
})
export class UIButton {
  private readonly defaults = inject(UI_BUTTON_DEFAULTS, { optional: true });

  /** Native button type attribute. */
  readonly type = input<"button" | "submit" | "reset">("button");

  /** Visual style variant. */
  readonly variant = input<ButtonVariant>(this.defaults?.variant ?? "filled");

  /** Colour preset. */
  readonly color = input<ButtonColor>(this.defaults?.color ?? "primary");

  /** Size preset. */
  readonly size = input<ButtonSize>(this.defaults?.size ?? "medium");

  /** Render with fully rounded (pill / capsule) shape. */
  readonly pill = input(this.defaults?.pill ?? false);

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
