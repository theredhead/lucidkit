# @theredhead/lucid-theme-studio — Public API Inventory

Package: `@theredhead/lucid-theme-studio`  
Source: `packages/ui-theme-studio/src/`

| Export               | Kind      | File                                             | Selector             | Description                                                                         |
| -------------------- | --------- | ------------------------------------------------ | -------------------- | ----------------------------------------------------------------------------------- |
| `UIThemeStudio`      | Component | `src/lib/theme-studio.component.ts`              | `ui-theme-studio`    | Slide-in drawer for inspecting and live-editing CSS design tokens                   |
| `UIThemeTokenRow`    | Component | `src/lib/token-row/theme-token-row.component.ts` | `ui-theme-token-row` | Single token row with name, description, type chips, and an inline editor           |
| `ThemeStudioService` | Service   | `src/lib/theme-studio.service.ts`                | —                    | Manages drawer visibility, manifest loading, overrides, filter state, export/import |
| `ThemeToken`         | Type      | `src/lib/theme-studio.types.ts`                  | —                    | Raw token entry from `css-token-manifest.json`                                      |
| `ThemeTokenManifest` | Type      | `src/lib/theme-studio.types.ts`                  | —                    | Shape of the manifest JSON                                                          |
| `ThemeTokenState`    | Type      | `src/lib/theme-studio.types.ts`                  | —                    | Token with live computed value and optional studio override                         |
| `ThemeTokenFilter`   | Type      | `src/lib/theme-studio.types.ts`                  | —                    | Active filter state (query, type, scope, namespace, modifiedOnly)                   |
