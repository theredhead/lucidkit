# @theredhead/ui-theme

Light/dark mode theming with CSS custom properties for theredhead Angular
applications. **No Angular Material dependency** — colours and typography are
defined as standalone SCSS variables derived from Material 3 tonal palettes.

---

## Installation

```bash
npm install @theredhead/ui-theme
```

---

## Usage

### 1. Import the theme styles

In your application's main `styles.scss`:

```scss
@use "@theredhead/ui-theme" as theme;

// Apply the full theme (sets all --theredhead-* and --ui-* custom properties)
@include theme.theredhead-theme();
```

### 2. Use the ThemeService

```typescript
import { Component, inject } from "@angular/core";
import { ThemeService } from "@theredhead/ui-theme";

@Component({
  selector: "app-root",
  template: `<button (click)="toggleTheme()">Toggle Theme</button>`,
})
export class AppComponent {
  private themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### 3. Theme modes

The library supports three theme modes:

| Mode     | Description                     |
| -------- | ------------------------------- |
| `light`  | Forces light mode               |
| `dark`   | Forces dark mode                |
| `system` | Follows OS / browser preference |

```typescript
themeService.setTheme("dark"); // Force dark
themeService.toggleTheme(); // Toggle light ↔ dark
themeService.resetToSystem(); // Follow system preference

// Reactive signals
const isDark = themeService.isDarkMode(); // Signal<boolean>
const isLight = themeService.isLightMode(); // Signal<boolean>
const mode = themeService.themeMode(); // Signal<'light'|'dark'|'system'>
```

---

## CSS custom property namespaces

| Namespace        | Scope                         | Examples                                                                  |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `--theredhead-*` | Global theme colours          | `--theredhead-primary`, `--theredhead-surface`, `--theredhead-background` |
| `--ui-*`         | Component-level design tokens | `--ui-text`, `--ui-border`, `--ui-accent`, `--ui-surface`                 |

---

## Dark mode (three-tier pattern)

All components and the theme mixin follow a three-tier dark-mode strategy:

```scss
// 1. Light defaults
html {
  --theredhead-primary: #0061a4;
}

// 2. Explicit dark class (toggled by ThemeService)
html.dark-theme {
  --theredhead-primary: #9ecaff;
}

// 3. System preference fallback (no class set)
@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) {
    --theredhead-primary: #9ecaff;
  }
}
```

---

## Customisation

Override the default palette by setting SCSS variables before importing:

```scss
@use "@theredhead/ui-theme/lib/styles/palettes" as palettes with (
  $light-primary: #006b5e,
  $dark-primary: #6bdbcb
);

@use "@theredhead/ui-theme" as theme;
@include theme.theredhead-theme();
```

All palette variables are declared `!default` so consumer overrides take
precedence.

---

## Architecture

```text
_palettes.scss      ← standalone colour variables (light + dark)
_typography.scss    ← font family, sizes, weights
_tokens.scss        ← all --ui-* CSS custom property definitions
_theme.scss         ← theredhead-theme() mixin (wires everything together)
_index.scss         ← barrel (@forward)

services/
  theme.service.ts  ← ThemeService (signals, localStorage, class toggling)

tokens/
  theme.tokens.ts   ← TypeScript constant mapping all --ui-* property names
  colors.ts         ← colour-name constants
```
