# AGENTS.md — @theredhead Angular UI Library

> **This is the single source of truth for all AI agents working in this
> repository.** Every convention, pattern, and architectural decision is
> documented here. When in doubt, follow this file.

---

## Read Before You Code

**Before writing or modifying any code, always read the relevant source
files, READMEs, JSDoc comments, and available documentation.** Never assume
an API shape, event name, input type, or default value — verify it by
reading the implementation first. This applies to:

- Component inputs, outputs, and host bindings
- Service methods and injection tokens
- Type definitions and union members
- Template syntax and directive selectors
- SCSS tokens and class names

Each package has a **`components.agents.md`** file listing every public
export with its kind, file path, selector, and one-line description. Consult
these inventories to locate the right file, then read that file before
using or modifying the API.

---

## Project Overview

This is an **Angular 21** component library workspace (`lucidkit-workspace`)
built with standalone components, signals, and zero external runtime dependencies
beyond Angular core and CDK. It ships three npm packages:

| Package                        | Scope      | Purpose                                                                                     |
| ------------------------------ | ---------- | ------------------------------------------------------------------------------------------- |
| `@theredhead/lucid-foundation` | Core       | Logger, type utilities, base classes — shared by all higher-level packages                  |
| `@theredhead/lucid-kit`        | Primitives | Button, Input, Select, Autocomplete, Filter, Table View, Map View, Theme Toggle, UI Density |
| `@theredhead/lucid-blocks`     | Composites | Master-Detail View, Navigation Page, Dashboard, Kanban, Chat, File Browser, etc.            |
| `@theredhead/lucid-forms`      | Forms      | Schema-driven forms, validation, conditional logic, form designer                           |
| `@theredhead/lucid-theme`      | Theming    | ThemeService, SCSS Material 3 theme mixin, design tokens                                    |

### API Inventories

Each package maintains a machine-readable inventory of its public API:

- [`packages/foundation/components.agents.md`](packages/foundation/components.agents.md)
- [`packages/ui-theme/components.agents.md`](packages/ui-theme/components.agents.md)
- [`packages/ui-kit/components.agents.md`](packages/ui-kit/components.agents.md)
- [`packages/ui-blocks/components.agents.md`](packages/ui-blocks/components.agents.md)
- [`packages/ui-forms/components.agents.md`](packages/ui-forms/components.agents.md)

**Keep these inventories up to date.** Whenever you add, rename, or remove a
public export (component, directive, service, type, function, etc.), update
the corresponding `components.agents.md` file in the same commit.

---

## Toolchain

| Tool       | Version                             | Notes                                                   |
| ---------- | ----------------------------------- | ------------------------------------------------------- |
| Angular    | 21                                  | Standalone components, signal APIs, OnPush everywhere   |
| TypeScript | 5.9+                                | `strict: true`, `noImplicitOverride`, `isolatedModules` |
| Build      | ng-packagr 21                       | Library builds via `npm run build --workspaces`         |
| Tests      | Vitest 4 + @analogjs/vitest-angular | `npx vitest run`, jsdom env, zoneless setup             |
| Lint       | ESLint 10 + angular-eslint 21       | `npm run lint`, flat config (`eslint.config.js`)        |
| Git hooks  | Husky + lint-staged                 | Pre-commit: lint staged `.ts` and `.html` files         |
| Storybook  | 10.x                                | `npm run storybook` → `ng run storybook-host:storybook` |
| Styles     | SCSS                                | Component-scoped, CSS custom property tokens            |

> **Zoneless architecture** — this library is fully zoneless. **Never** import
> or inject `NgZone`. All change detection is driven by Angular signals and
> `ChangeDetectionStrategy.OnPush`. The Vitest setup uses
> `@analogjs/vitest-angular/setup-testbed` with `zoneless: true`. If you need
> to escape Angular's change-detection cycle for high-frequency DOM events
> (e.g. `pointermove`), use plain `addEventListener` — do **not** reach for
> `NgZone.runOutsideAngular`.

---

## Component Conventions

### Decorator pattern

```ts
@Component({
  selector: "ui-<name>",
  standalone: true,
  imports: [/* only what the template needs */],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./<name>.component.html",
  styleUrl: "./<name>.component.scss",
  host: {
    class: "ui-<name>",
    // variant / state host classes — plain descriptive names only, never repeat the component name:
    "[class.<variant>]": "variant() === '<variant>'",
  },
})
```

### Naming

- **Selector prefix:** `ui-`
- **Class name:** `UI<PascalName>` — no `Component` suffix (e.g. `UIButton`, `UITextColumn`, `UIAutocomplete`)
- **File name:** `<name>.component.ts`, `<name>.component.html`, `<name>.component.scss`

### Signal API (always use modern signal APIs — never legacy decorators)

| API                   | Use for                     | Example                                                             |
| --------------------- | --------------------------- | ------------------------------------------------------------------- |
| `input<T>()`          | Optional inputs             | `readonly variant = input<ButtonVariant>("filled")`                 |
| `input.required<T>()` | Required inputs             | `readonly datasource = input.required<AutocompleteDatasource<T>>()` |
| `model<T>()`          | Two-way binding             | `readonly value = model<readonly T[]>([])`                          |
| `output<T>()`         | Events                      | `readonly itemSelected = output<T>()`                               |
| `signal<T>()`         | Internal mutable state      | `protected readonly query = signal("")`                             |
| `computed()`          | Derived state               | `protected readonly suggestions = computed(() => ...)`              |
| `contentChild()`      | Projected template queries  | `readonly tpl = contentChild<TemplateRef<C>>(TemplateRef)`          |
| `contentChildren()`   | Projected component queries | `columns = contentChildren(UITableViewColumn)`                      |
| `effect()`            | Side effects                | `effect(() => { ... })`                                             |

All input/model/signal fields are declared `readonly`.
Host bindings use declarative `host: {}` metadata — never `@HostBinding` / `@HostListener`.

### Accessibility

- Always provide an `ariaLabel` input: `readonly ariaLabel = input<string>("Default label")`
- Forward it to the native element: `[attr.aria-label]="ariaLabel()"`
- Use proper ARIA roles and patterns (combobox, listbox, table, etc.)

### JSDoc

- All public members get JSDoc comments
- Internal/protected methods: `/** @internal */`
- Types exported alongside the component get JSDoc too
- Always use multiline syntax (`/** … */`), never single-line `// …` for documentation
- Always prepend JSDoc with one blank line above the `/**` opener
- The closing `*/\n` must be immediately followed by the element it documents (no additional blank line between them)
- The only exception is single-tag flag comments such as `/** @inheritdoc */` and `/** @internal */` — these may appear inline as single-line blocks, though still must be preceeded by an empty line.

```ts
// ✅ correct
/** @inheritdoc */
public override ngOnDestroy(): void { … }

// ✅ correct
/** @internal */
protected readonly selectOptions = computed(() => this.options());

// ✅ correct
export class UIExample {

  /**
   * The current label value.
   */
  public readonly label = input<string>("");

  /**
   * Emits whenever the label changes.
   */
  public readonly labelChange = output<string>();
}

// ❌ wrong — no blank line before the comment
export class UIExample {
  /**
   * The current label value.
   */
  public readonly label = input<string>("");
  /**
   * Emits whenever the label changes.
   */
  public readonly labelChange = output<string>();
}

// ❌ wrong — blank line between comment and member
/**
 * The current label value.
 */

public readonly label = input<string>("");
```

---

## Access Modifiers

Every method and field in **every** class **must** have an explicit access
modifier (`public`, `protected`, or `private`). Never rely on TypeScript's
implicit `public`. This applies to constructors as well (`public constructor`,
`protected constructor`, `private constructor`).

---

## Logging

**Never call `console.log` / `console.warn` / `console.error` directly in
production code.** Use the `Logger` from `@theredhead/lucid-foundation` instead.

Inject `LoggerFactory` and create a context-scoped logger:

```ts
import { LoggerFactory } from "@theredhead/lucid-foundation";

export class UIMyComponent {
  private readonly log = inject(LoggerFactory).createLogger("UIMyComponent");

  public save(): void {
    this.log.debug("saving");
    this.log.warn("field missing", [fieldName]);
    this.log.error("save failed", [err]);
  }
}
```

Key rules:

- The **context** string should be the class name (e.g. `"UIRichTextEditor"`).
- Use `log.info()` for informational messages, `log.debug()` for verbose
  output, `log.warn()` for warnings, `log.error()` for errors.
- Pass additional data as an `unknown[]` in the second argument — do not
  concatenate into the message string.
- The default `ConsoleLoggingStrategy` writes to the browser console. Custom
  strategies (e.g. remote telemetry) can be passed to `createLogger()`.
- **Storybook stories and JSDoc examples** may still reference `console.log`
  for brevity — the rule applies to library source code only.

---

## Icons — No Emoji or Unicode Glyphs

**Never use emoji (🔍, 📅, 🎨 …) or Unicode symbol characters (↑, ↓, ✕, ◉,
☑ …) as visual icons in component templates.** Use the `UIIcon` component with
SVG content from the `UIIcons` registry instead.

```ts
import { UIIcon, UIIcons } from "@theredhead/lucid-kit";

@Component({
  imports: [UIIcon],
  template: `
    <ui-icon [svg]="UIIcons.Lucide.Arrows.ChevronUp" [size]="14" />
    <ui-icon [svg]="UIIcons.Lucide.Time.Calendar" [size]="16" />
  `,
})
export class UIMyComponent {
  protected readonly UIIcons = UIIcons;
}
```

Key rules:

- **Import** `UIIcon` (component) and `UIIcons` (registry) from
  `@theredhead/lucid-kit`.
- Add `UIIcon` to the component `imports` array.
- Reference icons via the categorised registry:
  `UIIcons.Lucide.<Category>.<IconName>`.
- If the template needs many icons, expose a helper object on the class
  (e.g. `protected readonly icons = { ... } as const;`) to keep templates
  short.
- The built-in registry is generated from Lucide SVG sources. Browse
  available icons at <https://lucide.dev>.
- **Custom icons** are allowed — pass any SVG inner-content string to the
  `[svg]` input. Design on a 24 × 24 grid with stroked paths.
- Emoji in **documentation prose** (README, JSDoc descriptions) is fine —
  this rule applies to rendered UI only.

---

## Colour Pairing — Always Set Both Foreground and Background

**Whenever you set a `color` (foreground) you _must_ also set a `background`
(or `background-color`), and vice-versa.** The two values must provide enough
contrast for the text to be legible (aim for WCAG AA — at least 4.5 : 1 for
normal text, 3 : 1 for large text).

This rule applies _everywhere_ colours are declared. Including but not limited to:

- Component SCSS (`:host`, inner selectors, dark-mode overrides)
- Inline `style` attributes in Storybook stories
- CSS custom-property fallback values (the fallback pair must be legible)

### Some more CSS rules

- Inline `style` attributes in templates are forbidden except in Storybook stories
- **Never use any class naming pattern that repeats the host or block name** — this
  includes BEM modifier syntax (`ui-toolbar--vertical`), BEM element syntax
  (`ui-toolbar__item`), and any other convention that prefixes or suffixes a class
  name with the component name. If a simple descriptive name works (`.vertical`,
  `.checked`, `.open`), use that. There is no exception.

### Good

```scss
.banner {
  color: #1d232b;
  background: #f7f8fa;
}
```

```html
<!-- ONLY in storybook -->
<div style="color: #1d232b; background: #f7f8fa; padding: 16px">…</div>
```

### Bad

```scss
// ❌ background without foreground — text may be invisible in some themes
.banner {
  background: #f7f8fa;
}
```

```html
<!-- ❌ sets background only -->
<div style="background: #f7f8fa">…</div>
```

When using CSS custom properties with fallbacks, ensure the fallback pair is
legible on its own:

```scss
.card {
  color: var(--ui-text, #1d232b);
  background: var(--ui-surface, #f7f8fa);
}
```

---

## Class Member Ordering

These rules apply to **all** TypeScript classes — components, services,
directives, pipes, and plain classes alike. Lay out members in this fixed order:

1. **Signal inputs / outputs / models** — `input()`, `input.required()`, `model()`, `output()`
2. **Queries** — `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`
3. **Computed signals** — `computed()`
4. **Public fields** — `public readonly …`, `public …`
5. **Protected fields** — `protected readonly …`, `protected …`
6. **Private fields** — `private readonly …`, `private …`
7. **Constructor** — `public constructor(…)`
8. **Static / factory methods** — `public static create(…)`, etc.
9. **Lifecycle hooks** — `ngOnInit`, `ngOnDestroy`, etc.
10. **Public methods**
11. **Protected methods**
12. **Private methods**

Items 1–3 only apply to Angular classes that use signals; for plain services or
utility classes, start at item 4.

```ts
export class UIExample {
  // 1. inputs / outputs / models
  public readonly label = input<string>("");
  public readonly clicked = output<void>();

  // 2. queries
  public readonly tpl = contentChild<TemplateRef<unknown>>(TemplateRef);

  // 3. computed
  protected readonly upper = computed(() => this.label().toUpperCase());

  // 4–6. fields (public → protected → private)
  public readonly id = crypto.randomUUID();
  protected readonly state = signal(false);
  private readonly destroy$ = new Subject<void>();

  // 7. constructor
  public constructor(private readonly cdr: ChangeDetectorRef) {}

  // 8. static / factory methods
  public static create(): UIExample {
    /* … */
  }

  // 9. lifecycle hooks
  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  // 10–12. methods (public → protected → private)
  public toggle(): void {
    this.state.update((s) => !s);
  }
  protected reset(): void {
    this.state.set(false);
  }
  private logMessage(msg: string): void {
    this.log.debug(msg);
  }
}
```

---

## CSS / SCSS Conventions

### Token namespace

| Namespace | Scope                              | Examples                                                                  |
| --------- | ---------------------------------- | ------------------------------------------------------------------------- |
| `--ui-*`  | All design tokens (global + local) | `--ui-text`, `--ui-border`, `--ui-accent`, `--ui-surface`, `--ui-density` |

All tokens live under the `--ui-*` namespace. They are declared centrally in
`_tokens.scss` and emitted on `html` by the `theredhead-theme()` mixin.

### Dark mode (centralised — do NOT add per-component three-tier blocks)

Dark mode is handled **globally** in `_theme.scss`. The `theredhead-theme()`
mixin emits all `--ui-*` tokens on three selectors:

```scss
html {
  @include tokens.ui-tokens-light;
}
html.dark-theme {
  @include tokens.ui-tokens-dark;
}

@media (prefers-color-scheme: dark) {
  html:not(.light-theme):not(.dark-theme) {
    @include tokens.ui-tokens-dark;
  }
}
```

**Components never declare their own three-tier blocks.** They consume tokens
via `var(--ui-text)`, `var(--ui-surface)` etc. and the cascade handles
light/dark switching automatically.

### UISurface directive — surface types

Components acquire background, border, and text colour through the `UISurface`
host directive (from `@theredhead/lucid-foundation`). The directive maps a
`surfaceType` input to CSS classes (`ui-surface-type-<value>`) defined in
`_surfaces.scss`.

Built-in types: `transparent`, `raised`, `sunken`, `panel`, `table`,
`table-header`, `table-body`, `table-footer`, `input`, `input-popup`,
`button`, `button-primary`.

Components that have an inherent surface role provide a DI default:

```ts
providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }];
```

Components that must **not** inherit a parent's surface type reset it:

```ts
providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "" }];
```

### Component-specific overridable tokens

When a component needs fine-grained control beyond `--ui-*`, declare its own
tokens with a nested fallback chain:

```scss
:host {
  --clock-rim: var(--ui-border-strong, #505d6d);
}
```

This allows override at three levels: component token → theme token → hardcoded
default. Do not add three-tier dark-mode blocks for these — the `--ui-*`
fallback handles dark mode.

### Selectors

- Host element variant/state classes: plain descriptive names only — `.vertical`,
  `.checked`, `.open`, `.disabled`. **Never** repeat the component name
  (no `ui-<name>--<variant>`, no BEM modifiers, no BEM elements).
- Inner element classes: plain descriptive names (`.chip`, `.table-cell`, `.badge-cell`)

---

## File Structure

### Simple component (button, input, select)

```
<name>/
  <name>.component.ts
  <name>.component.html
  <name>.component.scss
  <name>.component.spec.ts
  <name>.stories.ts
```

Export directly from `public-api.ts`: `export * from "./lib/<name>/<name>.component"`

### Complex feature (filter, table-view, autocomplete)

```
<feature>/
  index.ts                    ← barrel with named exports
  <feature>.component.ts
  <feature>.component.html
  <feature>.component.scss
  <feature>.component.spec.ts
  <feature>.stories.ts
  <sub-feature>/
    ...
```

Barrel (`index.ts`) uses explicit named exports with `type` keyword:

```ts
export { UIFilter } from "./filter.component";
export {
  type FilterFieldDefinition,
  type FilterOperator,
} from "./filter.types";
```

Export barrel from `public-api.ts`: `export * from "./lib/<feature>"`

### Table-view column pattern

Every column extends `UITableViewColumn` and registers via DI forwarding:

```ts
@Component({
  providers: [
    {
      provide: UITableViewColumn,
      useExisting: forwardRef(() => UIMyColumn),
    },
  ],
})
export class UIMyColumn extends UITableViewColumn {
  @ViewChild("cell", { static: true })
  public readonly cellTemplate!: TemplateRef<UITableViewCellContext>;
}
```

For `UITemplateColumn` (consumer-projected template): use `contentChild.required(TemplateRef)`
with a getter to unwrap the signal for the base-class contract.

---

## Testing Conventions

- **Framework:** Vitest 4 with `@analogjs/vitest-angular`
- **Run:** `npx vitest run`
- **File pattern:** `<name>.component.spec.ts` co-located with component

```ts
describe("UIButton", () => {
  let component: UIButton;
  let fixture: ComponentFixture<UIButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIButton], // standalone → imports, not declarations
    }).compileComponents();
    fixture = TestBed.createComponent(UIButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("defaults", () => {
    it('should default variant to "filled"', () => {
      expect(component.variant()).toBe("filled"); // call signal
    });
  });

  describe("variants", () => {
    for (const variant of variants) {
      it(`should apply ${variant} host class`, () => {
        fixture.componentRef.setInput("variant", variant); // set signal input
        fixture.detectChanges();
        expect(fixture.nativeElement.classList).toContain(variant);
      });
    }
  });
});
```

Key patterns:

- Standalone components go in `imports` (never `declarations`)
- Use `fixture.componentRef.setInput()` for signal inputs
- Call signals in assertions: `component.variant()`, not `component.variant`
- Nested `describe` blocks by feature area
- Parameterized tests via loops

---

## Storybook Conventions

- **Title hierarchy:** `@theredhead/<Package>/<Component>` (e.g. `@theredhead/UI Kit/Button`)
- **Tags:** always include `["autodocs"]`
- **Story type:** `StoryObj` with `render()` returning `{ template, props }`
- **argTypes:** use `satisfies` on options arrays for type safety
- **Complex demos:** create standalone wrapper `@Component` classes in the stories file,
  register them in the meta-level `moduleMetadata` decorator (never inside `render()`)

```ts
const meta: Meta<UIButton> = {
  title: "@theredhead/UI Kit/Button",
  component: UIButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<UIButton>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant">Click me</ui-button>`,
  }),
  args: { variant: "filled" },
};
```

### Source Code Examples (mandatory)

**Every story must include a `parameters.docs.source` block** so consumers can
copy-paste real usage code directly from the docs page. Use the three-section
format (`// ── HTML ──`, `// ── TypeScript ──`, `// ── SCSS ──`):

```ts
export const Default: Story = {
  render: (args) => ({
    /* … */
  }),
  args: { variant: "filled" },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-button variant="filled">Click me</ui-button>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIButton } from '@theredhead/lucid-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIButton],
  template: \\\`<ui-button variant="filled">Click me</ui-button>\\\`,
})
export class ExampleComponent {}

// ── SCSS ──
/* No custom styles needed — button tokens handle theming. */
`,
      },
    },
  },
};
```

Key rules:

- **Imports** must reference the published package name (`@theredhead/lucid-kit`),
  never relative paths.
- Show realistic, minimal usage — enough for a consumer to copy-paste.
- When the story wraps a demo component, the source block should show the
  **consumer-facing** API, not the internal wrapper.

### Storybook Cache Issues

When stories fail to load (ChunkLoadError), clear all caches:

```sh
rm -rf .angular node_modules/.cache dist/storybook storybook-static
```

Make sure no running Storybook process holds a lock before clearing `.angular`.

---

## Git Conventions

- **Branch:** feature branches (e.g. `feature/table-view`)
- **Commit messages:** conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`
- **Scope:** optional, matches package/feature — `feat(table-view):`, `fix(autocomplete):`
- **Body:** bullet list of changes, end with test/build status

---

## Verification Checklist

Before committing, always run:

1. `npx tsc --noEmit` — must be clean (zero errors)
2. `npx vitest run` — all tests must pass (currently 755)
3. `npm run lint` — zero errors (warnings are OK)
4. Check for IDE lint errors in modified files
