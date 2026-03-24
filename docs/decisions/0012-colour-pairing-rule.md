# ADR-0012: Colour Pairing Rule for Accessibility

## Status

Accepted

## Context

When styling components, it is common to set only one of `color` (foreground) or
`background-color` and rely on inheritance or the browser default for the other.
This creates a class of subtle accessibility bugs:

- A component sets `background: #1a1a2e` (dark) but inherits `color` from a
  dark-themed parent, producing invisible text.
- A light-themed badge sets `color: white` but inherits a white background from
  a card surface.

These issues are difficult to catch in automated tests and often only surface in
specific theme or nesting combinations.

## Decision

**Whenever a `color` (foreground) is set, a `background` (or
`background-color`) must also be set, and vice versa.** The paired values must
provide sufficient contrast for legibility, targeting WCAG AA compliance:

- At least **4.5 : 1** contrast ratio for normal-sized text.
- At least **3 : 1** for large text (18px+ or 14px+ bold).

This rule applies everywhere colours are declared:

- Component SCSS (`:host`, inner selectors, dark-mode overrides)
- Inline `style` attributes in Storybook stories
- CSS custom-property fallback values

### Correct

```scss
.banner {
  color: #1d232b;
  background: #f7f8fa;
}
```

```scss
.card {
  color: var(--ui-text, #1d232b);
  background: var(--ui-surface, #f7f8fa);
}
```

### Incorrect

```scss
/* ❌ background without foreground — text may be invisible */
.banner {
  background: #f7f8fa;
}

/* ❌ foreground without background — may clash with inherited bg */
.banner {
  color: #1d232b;
}
```

## Consequences

### Positive

- **Accessible by default:** Text is always legible regardless of the
  ancestor's theme or colour context.
- **Theme-safe:** Components are not affected by dark/light mode changes in
  parent components that alter inherited `color` or `background`.
- **Reviewable:** PRs can be mechanically checked — any `color` without a
  paired `background` (or vice versa) is a violation.

### Negative

- **More CSS declarations:** Every colour context requires two properties
  instead of one. This slightly increases stylesheet size.
- **Reduced cascade flexibility:** Components cannot inherit foreground or
  background from parents, which is occasionally desirable. In those cases, the
  component must explicitly use `inherit` or a CSS custom property to opt in.
- **Enforcement gap:** The rule is enforced by convention and code review, not
  by a linter rule (though one could be written).
