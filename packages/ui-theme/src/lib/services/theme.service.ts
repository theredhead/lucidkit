import { DOCUMENT } from "@angular/common";
import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  type Signal,
  type WritableSignal,
} from "@angular/core";

import { StorageService } from "@theredhead/lucid-foundation";

import {
  DEFAULT_THEME_CONFIG,
  THEME_CONFIG,
  type ThemeConfig,
  type ThemeMode,
} from "../tokens/theme.tokens";

/**
 * Service for managing application theme (light/dark mode).
 *
 * **Note:** This service is optional. If you only include the SCSS theme without
 * injecting this service, the theme will still work correctly:
 * - Light theme applies by default
 * - Dark theme applies automatically via `@media (prefers-color-scheme: dark)`
 * - All Material components are properly themed
 *
 * Use this service when you need:
 * - **User preference persistence** - Saves theme choice to localStorage across sessions
 * - **Explicit theme override** - Let users choose a theme different from system preference
 * - **Reactive state** - Access `isDarkMode()` signal for conditional UI logic
 * - **Theme toggle** - Programmatic control via `toggleTheme()` or `setTheme()`
 *
 * @example
 * ```typescript
 * import { ThemeService } from '@theredhead/lucid-theme';
 *
 * @Component({...})
 * export class AppComponent {
 *   private themeService = inject(ThemeService);
 *
 *   toggleTheme() {
 *     this.themeService.toggleTheme();
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config: ThemeConfig =
    inject(THEME_CONFIG, { optional: true }) ?? DEFAULT_THEME_CONFIG;
  private readonly storage = inject(StorageService);

  /** Current theme mode setting (light, dark, or system) */
  private readonly _themeMode: WritableSignal<ThemeMode>;

  /** Media query for detecting system dark mode preference */
  private readonly darkModeMediaQuery: MediaQueryList;

  /** Whether the system prefers dark mode */
  private readonly _systemPrefersDark: WritableSignal<boolean>;

  constructor() {
    // Initialize media query for system preference
    this.darkModeMediaQuery =
      this.document.defaultView?.matchMedia("(prefers-color-scheme: dark)") ??
      ({ matches: false } as MediaQueryList);

    this._systemPrefersDark = signal(this.darkModeMediaQuery.matches);

    // Listen for system preference changes
    if (this.darkModeMediaQuery.addEventListener) {
      this.darkModeMediaQuery.addEventListener("change", (e) => {
        this._systemPrefersDark.set(e.matches);
      });
    }

    // Initialize theme mode from storage or default
    const storedMode = this.getStoredThemeMode();
    this._themeMode = signal(storedMode ?? this.config.defaultMode);

    // Apply theme whenever mode or system preference changes
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  /**
   * Current theme mode setting
   */
  readonly themeMode: Signal<ThemeMode> = computed(() => this._themeMode());

  /**
   * Whether the system prefers dark mode
   */
  readonly systemPrefersDark: Signal<boolean> = computed(() =>
    this._systemPrefersDark(),
  );

  /**
   * Whether dark mode is currently active (resolved from mode + system preference)
   */
  readonly isDarkMode: Signal<boolean> = computed(() => {
    const mode = this._themeMode();
    if (mode === "system") {
      return this._systemPrefersDark();
    }
    return mode === "dark";
  });

  /**
   * Whether light mode is currently active
   */
  readonly isLightMode: Signal<boolean> = computed(() => !this.isDarkMode());

  /**
   * Set the theme mode
   * @param mode - The theme mode to set ('light', 'dark', or 'system')
   */
  setTheme(mode: ThemeMode): void {
    this._themeMode.set(mode);
    this.persistThemeMode(mode);
  }

  /**
   * Toggle between light and dark mode
   * If currently in system mode, will switch to the opposite of current resolved theme
   */
  toggleTheme(): void {
    const newMode = this.isDarkMode() ? "light" : "dark";
    this.setTheme(newMode);
  }

  /**
   * Reset to system preference
   */
  resetToSystem(): void {
    this.setTheme("system");
  }

  /**
   * Apply theme classes to the document
   */
  private applyTheme(isDark: boolean): void {
    const { documentElement } = this.document;

    if (isDark) {
      documentElement.classList.remove(this.config.lightModeClass);
      documentElement.classList.add(this.config.darkModeClass);
    } else {
      documentElement.classList.remove(this.config.darkModeClass);
      documentElement.classList.add(this.config.lightModeClass);
    }
  }

  /**
   * Get stored theme mode from localStorage
   */
  private getStoredThemeMode(): ThemeMode | null {
    try {
      const stored = this.storage.getItem(this.config.storageKey);
      if (stored && ["light", "dark", "system"].includes(stored)) {
        return stored as ThemeMode;
      }
    } catch {
      // Storage not available
    }
    return null;
  }

  /**
   * Persist theme mode to storage
   */
  private persistThemeMode(mode: ThemeMode): void {
    try {
      this.storage.setItem(this.config.storageKey, mode);
    } catch {
      // Storage not available
    }
  }
}
