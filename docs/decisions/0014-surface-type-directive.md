# ADR-0014: Surface Type Directive for Declarative Visual Treatment

## Status

Accepted

## Context

After centralising all `--ui-*` CSS tokens in `_tokens.scss` (see ADR-0005
amendment), individual components no longer declare their own colour values.
This raises the question: how do components acquire the correct background,
border, and text colour for their role (panel, table header, input, button,
etc.)?

Options considered:

1. **Per-component SCSS** — each component sets `background`, `color`, etc.
   directly. This worked before but led to large amounts of per-component CSS
   that duplicated the same surface treatments across many files.
2. **Utility classes** — Tailwind-style classes applied by consumers.
   Inconsistent and requires consumers to know internals.
3. **Host directive** — a single directive that maps a `surfaceType` input
   to a CSS class, with visual treatments defined once in the theme stylesheet.

Option 3 was chosen because it keeps component SCSS minimal, makes surface
styling consistently theme-aware, and lets both library authors and consumers
control the surface style via a single input.

## Decision

### UISurface host directive

A standalone directive (`UISurface`) is registered as a `hostDirective` on
every `ui-*` component. It exposes a `surfaceType` input that maps to one or
more CSS classes of the form `ui-surface-type-<value>`.

```typescript
@Directive({
  standalone: true,
  selector: "[uiSurface]",
  host: { "[class]": "hostClass()" },
})
export class UISurface {
  public readonly surfaceType = input<SurfaceType | SurfaceType[]>("");
  // computed() that builds "ui-surface-type-<value>" class string
}
```

### DI default

Components that have an inherent surface role provide a default via
`UI_DEFAULT_SURFACE_TYPE`:

```typescript
@Component({
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
})
export class UIFilter {}
```

When no explicit `surfaceType` is passed, the directive uses this default.
Components without a default (or with `useValue: ''`) receive no surface class.

### Theme stylesheet

`_surfaces.scss` defines the visual treatment for each built-in type:

| Type             | Background            | Extras                    |
| ---------------- | --------------------- | ------------------------- |
| `transparent`    | `transparent`         | —                         |
| `raised`         | `var(--ui-surface)`   | box-shadow                |
| `sunken`         | `var(--ui-surface-2)` | inset shadow              |
| `panel`          | `var(--ui-surface)`   | —                         |
| `table`          | `var(--ui-surface)`   | border + radius           |
| `table-header`   | `var(--ui-surface-2)` | muted text, bottom border |
| `table-body`     | `var(--ui-surface)`   | —                         |
| `table-footer`   | `var(--ui-surface-2)` | muted text, top border    |
| `input`          | `var(--ui-surface)`   | —                         |
| `input-popup`    | `var(--ui-surface)`   | border + dropdown shadow  |
| `button`         | `transparent`         | text colour               |
| `button-primary` | `var(--ui-accent)`    | contrast text             |

### Custom types

Consumers can define additional types by adding CSS classes with the
`ui-surface-type-` prefix:

```scss
.ui-surface-type-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}
```

```html
<ui-card surfaceType="glass">…</ui-card>
```

### Multiple types

The input accepts a space-separated string or an array to combine types:

```html
<ui-card [surfaceType]="['raised', 'glass']">…</ui-card>
```

## Consequences

### Positive

- **Single source of truth:** Surface styles are defined once in
  `_surfaces.scss` and reused by every component.
- **Consumer control:** Any component's surface can be overridden from a
  template without custom CSS.
- **Extensibility:** New surface types can be added with a single CSS class.
- **Minimal component CSS:** Components only declare structural layout; all
  colour/background/shadow decisions live in the surface system.

### Negative

- **DI inheritance:** Child components inherit `UI_DEFAULT_SURFACE_TYPE` from
  ancestors via the injector tree. Components that should not inherit a parent's
  surface type must explicitly provide `useValue: ''` (e.g. `UIIcon`).
- **Global CSS dependency:** The `_surfaces.scss` stylesheet must be included
  at the application level (via `theredhead-theme()`) for surface classes to
  have any effect.
