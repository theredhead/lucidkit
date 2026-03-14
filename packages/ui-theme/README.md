# @theredhead/ui-theme

Material 3 theme library for Theredhead applications with light and dark mode support.

## Installation

```bash
npm install @theredhead/ui-theme
```

## Usage

### 1. Import the theme styles

In your application's main styles file (e.g., `styles.scss`):

```scss
@use '@theredhead/ui-theme' as theme;

// Apply the full theme (includes Material 3 theming and light/dark mode)
@include theme.theredhead-theme();
```

### 2. Use the theme service

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from '@theredhead/ui-theme';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="toggleTheme()">Toggle Theme</button>
  `
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
- `light` - Light mode only
- `dark` - Dark mode only
- `system` - Follows system preference (default)

```typescript
// Set specific theme
themeService.setTheme('dark');

// Toggle between light and dark
themeService.toggleTheme();

// Follow system preference
themeService.setTheme('system');

// Get current theme as signal
const isDark = themeService.isDarkMode();
```

## Customization

You can customize the theme colors by overriding the default palette:

```scss
@use '@theredhead/ui-theme' as theme with (
  $primary-hue: 250,      // Custom primary color hue
  $secondary-hue: 330,    // Custom secondary color hue
  $tertiary-hue: 60,      // Custom tertiary color hue
  $error-hue: 0           // Custom error color hue
);

@include theme.theredhead-theme();
```
