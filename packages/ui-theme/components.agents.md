# @theredhead/ui-theme — API Inventory

> Machine-readable inventory of all public exports.
> Referenced from the root [AGENTS.md](../../AGENTS.md).

## Exports

| Kind      | Name                   | File                                       | Selector | Description                                                                                  |
| --------- | ---------------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| Service   | `ThemeService`         | `src/lib/services/theme.service.ts`        | —        | Manages application theme (light/dark/system) with signal state and localStorage persistence |
| Service   | `ThemeStudioService`   | `src/lib/services/theme-studio.service.ts` | —        | Opens a standalone Theme Studio popup window for live-editing CSS custom properties          |
| Interface | `ThemeConfig`          | `src/lib/tokens/theme.tokens.ts`           | —        | Configuration for theme behaviour (default mode, storage key, CSS class names)               |
| Interface | `ThemeStudioToken`     | `src/lib/services/theme-studio.service.ts` | —        | Single token entry in the manifest (name, description, type, scope, values)                  |
| Interface | `ThemeStudioManifest`  | `src/lib/services/theme-studio.service.ts` | —        | Complete token manifest shape (token count, namespace, token array)                          |
| Interface | `ThemeStudioOptions`   | `src/lib/services/theme-studio.service.ts` | —        | Configuration for opening the Theme Studio popup (width, height, manifest)                   |
| Type      | `ThemeMode`            | `src/lib/tokens/theme.tokens.ts`           | —        | `'light' \| 'dark' \| 'system'`                                                              |
| Type      | `UITokenName`          | `src/lib/tokens/ui-tokens.ts`              | —        | Union of all `--ui-*` CSS custom property names as string literals                           |
| Constant  | `DEFAULT_THEME_CONFIG` | `src/lib/tokens/theme.tokens.ts`           | —        | Default theme configuration (system mode, localStorage key, CSS classes)                     |
| Token     | `THEME_CONFIG`         | `src/lib/tokens/theme.tokens.ts`           | —        | InjectionToken for providing custom ThemeConfig                                              |
| Constant  | `UI_TOKENS`            | `src/lib/tokens/ui-tokens.ts`              | —        | Object containing 70+ `--ui-*` CSS property name strings by category                         |
