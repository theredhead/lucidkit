# ADR-0008: SVG Icon Registry — No Emoji or Unicode Glyphs

## Status

Accepted

## Context

UI components frequently need icons for actions (close, expand, search),
indicators (calendar, clock), and decorations. Common approaches include:

- **Icon fonts** (Font Awesome, Material Icons): add a web font dependency,
  render as text, limited styling control.
- **Emoji / Unicode glyphs** (🔍, ✕, ↑): inconsistent rendering across
  platforms and OS versions, no colour control, poor accessibility.
- **Inline SVG:** full styling control, accessible, but managing dozens of SVG
  snippets across components is tedious.

## Decision

The library provides a **generated SVG icon registry** (`UIIcons`) and a
dedicated `UIIcon` component. Icons are referenced by category and name:

```html
<ui-icon [svg]="UIIcons.Lucide.Arrows.ChevronUp" [size]="14" />
```

Key rules:

- **No emoji or Unicode symbol characters** in rendered component templates.
  Emoji in documentation prose (README, JSDoc) is permitted.
- Icons are sourced from [Lucide](https://lucide.dev) SVGs and compiled into a
  TypeScript registry by `scripts/generate-icon-registry.mjs`.
- Custom icons are supported — pass any SVG inner-content string to the `[svg]`
  input. Custom SVGs should use a 24 × 24 grid with stroked paths.
- The `UIIcon` component handles sizing, colour inheritance, and accessibility
  attributes.

## Consequences

### Positive

- **Consistent rendering:** SVG icons look identical across every browser and
  OS.
- **Full styling control:** Icons inherit `currentColor`, respond to CSS
  transforms, and scale without pixellation.
- **Tree-shakeable (in principle):** Only referenced icon strings are included
  in bundles. Unused categories add no weight.
- **Accessible:** `UIIcon` supports `aria-label` and `role="img"` attributes.
- **No font loading:** No FOIT/FOUT from web font downloads.

### Negative

- **Registry maintenance:** Adding new icons requires updating the Lucide
  source set and re-running the generator script.
- **Verbosity:** `UIIcons.Lucide.Arrows.ChevronUp` is longer than `▲` or a
  plain CSS class. This is intentional — explicit is better than implicit.
- **Bundle size:** The full registry includes all Lucide icons. A production
  library could benefit from per-icon imports or a build-time tree-shaking
  strategy.
