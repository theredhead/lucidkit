# @theredhead/ui-theme

Light/dark mode theming with CSS custom properties for Theredhead Angular
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

## SCSS Modules

The theme ships several SCSS modules that consuming libraries and components
can import individually. The canonical import alias is shown in each heading.

### Mixins (`@use 'mixins' as mix`)

Reusable SCSS mixins available to every component:

| Mixin                         | Description                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `dark-mode($selector?)`       | Three-tier dark-mode wrapper (host-context + media query)   |
| `focus-ring($offset, $color)` | WCAG AA visible `:focus-visible` outline                    |
| `control-reset`               | Strips default browser chrome from buttons                  |
| `truncate`                    | Single-line text-overflow ellipsis                          |
| `disabled($opacity, $block)`  | Reduced opacity + cursor/pointer-events toggle              |
| `visually-hidden`             | Screen-reader-only hiding (a11y)                            |
| `scrollable($axis)`           | `overflow` with momentum scroll and flex-shrink containment |

```scss
@use "mixins" as mix;

:host {
  --ui-text: #1d232b;
  --ui-border: #d7dce2;
}

@include mix.dark-mode {
  --ui-text: #f2f6fb;
  --ui-border: #3a3f47;
}

button {
  @include mix.control-reset;
  @include mix.focus-ring;
}

.label {
  @include mix.truncate;
}
```

### Elevation (`@use 'elevation' as elev`)

Shadow scale with paired light/dark variants. All variables are `!default`.

| Variable                      | Use case                                 |
| ----------------------------- | ---------------------------------------- |
| `$shadow-sm-light/dark`       | Cards, panels at rest                    |
| `$shadow-md-light/dark`       | Hover states, card lift, dropdown panels |
| `$shadow-lg-light/dark`       | Popovers, drawers                        |
| `$shadow-xl-light/dark`       | Dialogs, modals                          |
| `$shadow-dropdown-light/dark` | Dropdown menus, autocomplete panels      |

```scss
@use "elevation" as elev;

.card {
  box-shadow: elev.$shadow-sm-light;
}
```

Components can also reference the CSS custom properties emitted by
`_tokens.scss`: `var(--ui-shadow-sm)`, `var(--ui-shadow-md)`, etc.

### Animation (`@use 'animation' as anim`)

Centralised timing and easing tokens. All variables are `!default`.

| Variable           | Value         | Use case                            |
| ------------------ | ------------- | ----------------------------------- |
| `$duration-fast`   | `80ms`        | Subtle hover feedback, icon pulses  |
| `$duration-normal` | `120ms`       | Button, input, toggle transitions   |
| `$duration-medium` | `150ms`       | Box-shadow, transform transitions   |
| `$duration-slow`   | `200ms`       | Modals, drawers, complex animations |
| `$easing-default`  | `ease`        | Standard property transitions       |
| `$easing-out`      | `ease-out`    | Enter / appear animations           |
| `$easing-in`       | `ease-in`     | Exit / dismiss animations           |
| `$easing-in-out`   | `ease-in-out` | Symmetric (pulse, toggle)           |

```scss
@use "animation" as anim;

button {
  transition: background-color anim.$duration-normal anim.$easing-default;
}
```

---

## `UI_TOKENS` — Programmatic Token Access

The `ui-tokens.ts` module exports a `UI_TOKENS` constant that maps every
`--ui-*` CSS custom property name to a typed string constant. This is useful
for reading token values from TypeScript at runtime:

```typescript
import { UI_TOKENS } from "@theredhead/ui-theme";

const accent = getComputedStyle(el).getPropertyValue(UI_TOKENS.accent);
```

---

## Architecture

```text
_palettes.scss      ← standalone colour variables (light + dark, Material 3)
_typography.scss    ← font family, sizes, weights, line heights
_tokens.scss        ← all --ui-* CSS custom property definitions
_mixins.scss        ← dark-mode, focus-ring, control-reset, truncate, etc.
_elevation.scss     ← shadow scale (sm / md / lg / xl / dropdown)
_animation.scss     ← duration & easing tokens
_theme.scss         ← theredhead-theme() mixin (wires everything together)
_index.scss         ← barrel (@forward)

services/
  theme.service.ts  ← ThemeService (signals, localStorage, class toggling)

tokens/
  theme.tokens.ts   ← ThemeMode type, ThemeConfig, THEME_CONFIG DI token
  ui-tokens.ts      ← UI_TOKENS constant mapping all --ui-* property names
  colors.ts         ← RgbColor / HslColor utility classes
```
