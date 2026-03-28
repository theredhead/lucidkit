# @theredhead/ui-theme

Light/dark mode theming with CSS custom properties for theredhead Angular
applications. **No Angular Material dependency** — colours and typography are
defined as standalone SCSS variables derived from Material 3 tonal palettes.

All colour, surface, and spacing decisions flow through a single set of
`--ui-*` CSS custom properties defined in `_tokens.scss` and applied globally
by the `theredhead-theme()` SCSS mixin. Individual components consume these
tokens via `var(--ui-*)` — they never redeclare their own dark-mode tiers.

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

// Apply the full theme (sets all --ui-* custom properties on html)
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

## CSS Custom Property Namespaces

| Namespace | Scope                              | Examples                                                  |
| --------- | ---------------------------------- | --------------------------------------------------------- |
| `--ui-*`  | All design tokens (global + local) | `--ui-text`, `--ui-border`, `--ui-accent`, `--ui-surface` |

All tokens live under the `--ui-*` namespace. They are declared once in
`_tokens.scss` and emitted on `html` by the `theredhead-theme()` mixin.
Components consume them with `var(--ui-text)` etc., inheriting the correct
light or dark value automatically.

---

## Dark Mode — Centralised Three-Tier Pattern

Dark mode is handled **centrally** in `_theme.scss` and `_tokens.scss`. The
`theredhead-theme()` mixin emits the full token set on three selectors:

```scss
// 1. Light defaults
html {
  @include tokens.ui-tokens-light; // --ui-text: #1d232b; --ui-surface: #fff; …
  line-height: 1.5;
}

// 2. Explicit dark class (toggled by ThemeService)
html.dark-theme {
  @include tokens.ui-tokens-dark; // --ui-text: #f2f6fb; --ui-surface: #2a2f38; …
}

// 3. System preference fallback (no class set)
@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) {
    @include tokens.ui-tokens-dark;
  }
}
```

**Components never declare their own three-tier blocks.** They consume tokens
via `var(--ui-*)` and the cascade handles light/dark switching. This eliminates
the duplication that the original per-component pattern required.

---

## UISurface — Declarative Surface Styling

The `UISurface` host directive (from `@theredhead/foundation`) maps a
`surfaceType` input to CSS classes on the host element. The theme stylesheet
(`_surfaces.scss`) provides the visual treatment for each type.

### Built-in surface types

| Type             | CSS Class                         | Visual Treatment                                 |
| ---------------- | --------------------------------- | ------------------------------------------------ |
| `transparent`    | `.ui-surface-type-transparent`    | Fully transparent background                     |
| `raised`         | `.ui-surface-type-raised`         | Surface background + elevation shadow            |
| `sunken`         | `.ui-surface-type-sunken`         | Secondary surface + inset shadow                 |
| `panel`          | `.ui-surface-type-panel`          | Surface background                               |
| `table`          | `.ui-surface-type-table`          | Border + radius + full table container treatment |
| `table-header`   | `.ui-surface-type-table-header`   | Muted text, surface-2 bg, bottom border          |
| `table-body`     | `.ui-surface-type-table-body`     | Standard surface with text colour                |
| `table-footer`   | `.ui-surface-type-table-footer`   | Muted text, surface-2 bg, top border             |
| `input`          | `.ui-surface-type-input`          | Standard text + surface background               |
| `input-popup`    | `.ui-surface-type-input-popup`    | Border + dropdown shadow                         |
| `button`         | `.ui-surface-type-button`         | Transparent background with text colour          |
| `button-primary` | `.ui-surface-type-button-primary` | Accent background + contrast text                |

### Providing a default surface type via DI

Components can declare a default surface type with `UI_DEFAULT_SURFACE_TYPE`:

```typescript
import { UI_DEFAULT_SURFACE_TYPE } from "@theredhead/foundation";

@Component({
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
})
export class UIMyPanel {}
```

The directive falls back to this token when no explicit `surfaceType` is
passed by the consumer.

### Custom surface types

Define a CSS class with the `ui-surface-type-` prefix and pass the suffix:

```scss
.ui-surface-type-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
```

```html
<ui-card surfaceType="glass">…</ui-card>
```

Multiple types can be combined (space-separated or array):

```html
<ui-card surfaceType="raised glass">…</ui-card>
<ui-card [surfaceType]="['raised', 'glass']">…</ui-card>
```

---

## Component-Specific Overridable Tokens

Some components define their own CSS custom properties that map down to the
`--ui-*` theme tokens via nested fallback chains. This gives consumers fine-
grained control without needing to know the component internals.

### Pattern: nested fallback chain

```scss
// In the component SCSS:
:host {
  --clock-rim: var(--ui-border-strong, #505d6d);
  --clock-face: var(--ui-surface, #ffffff);
}
```

| Layer                    | Override method                 | Example                                      |
| ------------------------ | ------------------------------- | -------------------------------------------- |
| Component-specific token | Set `--clock-rim` on the host   | `<ui-analog-clock style="--clock-rim: red">` |
| Theme token              | Override `--ui-border-strong`   | `:root { --ui-border-strong: #888; }`        |
| Hardcoded fallback       | Always available as last resort | `#505d6d`                                    |

This pattern keeps components themeable at multiple granularity levels.

---

## Customisation

Override colours by passing parameters to the `theredhead-theme()` mixin:

```scss
@use "@theredhead/ui-theme" as theme;

@include theme.theredhead-theme(
  $primary-color: #006b5e,
  $brand-color: #004d40,
  $error-color: #c62828
);
```

Or override individual `--ui-*` tokens directly in your stylesheet:

```scss
html {
  --ui-accent: #006b5e;
  --ui-border: #ccc;
}
```

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
_tokens.scss        ← all --ui-* CSS custom property definitions (light + dark mixins)
_surfaces.scss      ← UISurface visual treatment classes (.ui-surface-type-*)
_theme.scss         ← theredhead-theme() mixin (three-tier dark mode, wires everything)
_typography.scss    ← font family, sizes, weights, line heights
_mixins.scss        ← dark-mode, focus-ring, control-reset, truncate, etc.
_elevation.scss     ← shadow scale (sm / md / lg / xl / dropdown)
_animation.scss     ← duration & easing tokens
_index.scss         ← barrel (@forward)

services/
  theme.service.ts  ← ThemeService (signals, localStorage, class toggling)

tokens/
  theme.tokens.ts   ← ThemeMode type, ThemeConfig, THEME_CONFIG DI token
  ui-tokens.ts      ← UI_TOKENS constant mapping all --ui-* property names
  colors.ts         ← RgbColor / HslColor utility classes
```

### Token flow

```text
_tokens.scss                   _surfaces.scss
  ├─ ui-tokens-light mixin       ├─ .ui-surface-type-panel
  └─ ui-tokens-dark mixin        ├─ .ui-surface-type-raised
         │                        ├─ .ui-surface-type-table
         ▼                        └─ …
  _theme.scss
    theredhead-theme() ──┐
                         ├──▶ html           { @include ui-tokens-light }
                         ├──▶ html.dark-theme { @include ui-tokens-dark  }
                         └──▶ @media(dark)   { @include ui-tokens-dark  }

Component SCSS:
  color: var(--ui-text);
  background: var(--ui-surface);
  ↑ inherits correct value from the html-level declarations
```
