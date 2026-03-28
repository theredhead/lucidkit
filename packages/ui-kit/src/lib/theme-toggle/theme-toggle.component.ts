import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";

import { ThemeService } from "@theredhead/ui-theme";
import { UISurface } from '@theredhead/foundation';

export type ThemeToggleVariant = "icon" | "button";

/** @internal — SVG path for the sun icon (shown in dark mode). */
const SUN_ICON =
  "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2h1zM4 11a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h1zm15.07-6.07a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 0 1 1.41 0zM7.05 17.66a1 1 0 0 1 0 1.41l-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 0 1 1.41 0zm12.02 2.12a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 1 1 1.42-1.42l.7.71a1 1 0 0 1 0 1.41zM7.05 6.34a1 1 0 0 1-1.41 0l-.71-.7a1 1 0 0 1 1.42-1.42l.7.71a1 1 0 0 1 0 1.41z";

/** @internal — SVG path for the moon icon (shown in light mode). */
const MOON_ICON =
  "M12.1 22c-5.52 0-10-4.48-10-10 0-4.75 3.31-8.72 7.75-9.74a.78.78 0 0 1 .9 1.01A8.26 8.26 0 0 0 10.1 6c0 4.56 3.7 8.25 8.26 8.25.99 0 1.94-.18 2.84-.5a.78.78 0 0 1 1 .9A10.01 10.01 0 0 1 12.1 22z";

/**
 * A toggle button for switching between light and dark mode.
 *
 * Uses the {@link ThemeService} from `@theredhead/ui-theme` to manage
 * theme state. Renders inline SVG icons — no external icon font required.
 *
 * @example
 * ```html
 * <!-- Icon button (default) -->
 * <ui-theme-toggle />
 *
 * <!-- Raised button variant -->
 * <ui-theme-toggle variant="button" />
 * ```
 */
@Component({
  selector: "ui-theme-toggle",
  standalone: true,
  imports: [],
  templateUrl: "./theme-toggle.component.html",
  styleUrls: ["./theme-toggle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: {
    class: "ui-theme-toggle",
    "[class.ui-theme-toggle--disabled]": "disabled()",
  },
})
export class UIThemeToggle {
  protected readonly themeService = inject(ThemeService);

  /** Whether the toggle is disabled. */
  public readonly disabled = input<boolean>(false);

  /** Visual style of the toggle. */
  public readonly variant = input<ThemeToggleVariant>("icon");

  /** Accessible label for the button. */
  public readonly ariaLabel = input<string>("Toggle theme");

  /** @internal — SVG path for the currently displayed icon. */
  protected get iconPath(): string {
    return this.themeService.isDarkMode() ? SUN_ICON : MOON_ICON;
  }

  /** @internal — label text shown in `button` variant. */
  protected get label(): string {
    return this.themeService.isDarkMode() ? "Light" : "Dark";
  }

  /** Toggle the current theme. */
  public toggle(): void {
    this.themeService.toggleTheme();
  }
}
