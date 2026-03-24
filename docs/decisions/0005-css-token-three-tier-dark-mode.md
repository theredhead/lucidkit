# ADR-0005: CSS Design Tokens with Three-Tier Dark Mode

## Status

Accepted

## Context

A component library needs a theming system that:

1. Lets consumers customise appearance without overriding internal selectors.
2. Supports light and dark modes reliably.
3. Works with system-level preference detection (`prefers-color-scheme`).
4. Avoids FOUC (flash of unstyled content) when the user has an explicit
   preference.

CSS custom properties (design tokens) are the standard mechanism for this in
modern component libraries. The question is how to organise them and how to
handle the three possible dark-mode states: explicit light, explicit dark, and
system-default.

## Decision

### Token namespaces

Two namespaces of CSS custom properties:

| Namespace        | Scope                            | Examples                                                  |
| ---------------- | -------------------------------- | --------------------------------------------------------- |
| `--ui-*`         | Component-level tokens           | `--ui-text`, `--ui-surface`, `--ui-border`, `--ui-accent` |
| `--theredhead-*` | Global theme tokens (Material 3) | `--theredhead-primary`, `--theredhead-background`         |

Component SCSS references `--ui-*` tokens. The global theme SCSS mixin
(`theredhead-theme()`) assigns `--theredhead-*` values, and components map from
global to local as needed.

### Three-tier dark mode

Every component's SCSS follows a mandatory three-tier pattern:

```scss
/* 1. Light defaults */
:host {
  --ui-text: #1d232b;
  --ui-border: #d7dce2;
}

/* 2. Explicit dark class (user chose dark) */
:host-context(html.dark-theme) {
  --ui-text: #f2f6fb;
  --ui-border: #3a3f47;
}

/* 3. System preference fallback (no explicit choice) */
@media (prefers-color-scheme: dark) {
  :host-context(html:not(.light-theme):not(.dark-theme)) {
    --ui-text: #f2f6fb;
    --ui-border: #3a3f47;
  }
}
```

- **Tier 1** ensures a sensible default in all environments.
- **Tier 2** responds to `ThemeService.setTheme('dark')`, which adds
  `html.dark-theme`.
- **Tier 3** respects the OS setting when the user has not made an explicit
  choice (no `.light-theme` or `.dark-theme` class on `<html>`).

### Typed token registry

`@theredhead/ui-theme` exports a `UI_TOKENS` constant and `UI_TokenName` union
type, providing a typed, discoverable catalogue of all token names.

## Consequences

### Positive

- **Consumer customisation:** Override a few `--ui-*` tokens to retheme any
  component without touching SCSS internals.
- **No FOUC:** When `ThemeService` applies `dark-theme` on page load (from
  persisted preference), Tier 2 activates immediately. When no preference is
  stored, Tier 3 uses the OS setting with no JS needed.
- **Component encapsulation:** Each component owns its token defaults. Global
  theme changes propagate through the cascade without coupling.
- **Type safety:** `UI_TOKENS` and `UI_TokenName` catch token typos at
  compile time.

### Negative

- **Duplication:** Dark-mode values are repeated in Tier 2 and Tier 3 of every
  component. A SCSS mixin could reduce this, but the explicit pattern was chosen
  for clarity.
- **Specificity management:** `:host-context()` selectors can interact
  unexpectedly with deeply nested component trees. Testing across nesting depths
  is required.
