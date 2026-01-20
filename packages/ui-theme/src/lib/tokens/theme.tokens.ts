import { InjectionToken } from '@angular/core';

/**
 * Theme mode type - light, dark, or system (auto-detect current system setting)
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration options
 */
export interface ThemeConfig {
    /** Default theme mode */
    defaultMode: ThemeMode;
    /** Storage key for persisting theme preference */
    storageKey: string;
    /** CSS class applied to the document for dark mode */
    darkModeClass: string;
    /** CSS class applied to the document for light mode */
    lightModeClass: string;
}

/**
 * Default theme configuration
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
    defaultMode: 'system',
    storageKey: 'theredhead-theme-mode',
    darkModeClass: 'dark-theme',
    lightModeClass: 'light-theme',
};

/**
 * Injection token for theme configuration
 */
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG', {
    providedIn: 'root',
    factory: () => DEFAULT_THEME_CONFIG,
});
