# ADR-0005: CSS Design Tokens with Three-Tier Dark Mode

## Status

Accepted — **amended**: per-component three-tier blocks replaced by centralised
token declarations (see _Amendments_ section).

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

### Token namespace

All design tokens use the `--ui-*` namespace. They are declared centrally in
`_tokens.scss` and emitted on `html` by the `theredhead-theme()` mixin.
Components consume tokens via `var(--ui-text)`, `var(--ui-surface)`, etc.,
inheriting the correct value through the CSS cascade.

### Three-tier dark mode (centralised)

The `theredhead-theme()` mixin in `_theme.scss` applies the full token set
on three selectors:

```scss
// 1. Light defaults
html {
  @include tokens.ui-tokens-light;
  line-height: 1.5;
}

// 2. Explicit dark class (user chose dark via ThemeService)
html.dark-theme {
  @include tokens.ui-tokens-dark;
}

// 3. System preference fallback (no explicit choice)
@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) {
    @include tokens.ui-tokens-dark;
  }
}
```

- **Tier 1** ensures a sensible default in all environments.
- **Tier 2** responds to `ThemeService.setTheme('dark')`, which adds
  `html.dark-theme`.
- **Tier 3** respects the OS setting when the user has not made an explicit
  choice (no `.light-theme` or `.dark-theme` class on `<html>`).

**Components never declare their own three-tier blocks.** They reference
`var(--ui-*)` tokens and the cascade handles light/dark switching
automatically.

### Component-specific tokens (nested fallback chain)

When a component needs fine-grained overrides beyond the global `--ui-*`
tokens, it declares its own CSS custom properties with a nested fallback:

```scss
:host {
  --clock-rim: var(--ui-border-strong, #505d6d);
}
```

This gives consumers three override levels:

1. Set `--clock-rim` directly on the element
2. Override `--ui-border-strong` globally
3. Fall through to the hardcoded default

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
- **Zero duplication:** Tokens are declared once (two mixins: light + dark).
  Components have no dark-mode SCSS at all.
- **Type safety:** `UI_TOKENS` and `UI_TokenName` catch token typos at
  compile time.

### Negative

- **Global coupling:** All components depend on the theme mixin being included
  at the application level. Without it, no tokens are defined.
- **Specificity:** Consumer overrides on `html` compete with the same
  specificity as the built-in declarations. Order matters.

## Amendments

### Centralised tokens (replaces per-component pattern)

The original decision required every component to declare its own three-tier
dark-mode block (`":host"`, `":host-context(html.dark-theme)"`,
`"@media (prefers-color-scheme: dark)"`). This caused significant duplication —
dark values were repeated in Tier 2 and Tier 3 of every component SCSS file.

The architecture was refactored to **centralise all token declarations** in
`_tokens.scss` via two mixins (`ui-tokens-light` / `ui-tokens-dark`). The
`theredhead-theme()` mixin emits both sets on `html`. Components now only
reference `var(--ui-*)` and never include dark-mode selectors themselves.

The three-tier strategy is unchanged — only its location has moved from
individual components to the global theme mixin.
