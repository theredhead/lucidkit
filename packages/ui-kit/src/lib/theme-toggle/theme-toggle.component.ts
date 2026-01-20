import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '@theredhead/ui-theme';

export type ThemeToggleVariant = 'icon' | 'button';

/**
 * A toggle button for switching between light and dark mode.
 *
 * Uses the ThemeService from @theredhead/ui-theme to manage theme state.
 * The button displays a sun icon in dark mode and a moon icon in light mode,
 * indicating what theme will be applied when clicked.
 *
 * @example
 * ```html
 * <!-- Icon button (default) -->
 * <ui-theme-toggle />
 *
 * <!-- With tooltip -->
 * <ui-theme-toggle showTooltip />
 *
 * <!-- Raised button variant -->
 * <ui-theme-toggle variant="button" />
 * ```
 */
@Component({
    selector: 'ui-theme-toggle',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    templateUrl: './theme-toggle.component.html',
    styleUrls: ['./theme-toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiThemeToggleComponent {
    protected readonly themeService = inject(ThemeService);

    /** Visual style of the toggle */
    readonly variant = input<ThemeToggleVariant>('icon');

    /** Whether to show a tooltip on hover */
    readonly showTooltip = input<boolean>(false);

    /** Accessible label for the button */
    readonly ariaLabel = input<string>('Toggle theme');

    /** Computed tooltip text based on current theme */
    protected get tooltipText(): string {
        return this.themeService.isDarkMode()
            ? 'Switch to light mode'
            : 'Switch to dark mode';
    }

    /** Icon to display based on current theme (shows what will be applied) */
    protected get icon(): string {
        return this.themeService.isDarkMode() ? 'light_mode' : 'dark_mode';
    }

    toggle(): void {
        this.themeService.toggleTheme();
    }
}
