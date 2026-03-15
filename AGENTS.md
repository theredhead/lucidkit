# AGENTS.md — @theredhead Angular UI Library

> **This is the single source of truth for all AI agents working in this
> repository.** Every convention, pattern, and architectural decision is
> documented here. When in doubt, follow this file.

---

## Project Overview

This is an **Angular 21** component library workspace (`theredhead-fe-workspace`)
built with standalone components, signals, and zero external runtime dependencies
beyond Angular core and CDK. It ships three npm packages:

| Package                 | Scope      | Purpose                                                                                     |
| ----------------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `@theredhead/ui-kit`    | Primitives | Button, Input, Select, Autocomplete, Filter, Table View, Map View, Theme Toggle, UI Density |
| `@theredhead/ui-blocks` | Composites | Master-Detail View (higher-level compositions)                                              |
| `@theredhead/ui-theme`  | Theming    | ThemeService, SCSS Material 3 theme mixin, design tokens                                    |

---

## Toolchain

| Tool       | Version                             | Notes                                                   |
| ---------- | ----------------------------------- | ------------------------------------------------------- |
| Angular    | 21                                  | Standalone components, signal APIs, OnPush everywhere   |
| TypeScript | 5.9+                                | `strict: true`, `noImplicitOverride`, `isolatedModules` |
| Build      | ng-packagr 21                       | Library builds via `npm run build --workspaces`         |
| Tests      | Vitest 4 + @analogjs/vitest-angular | `npx vitest run`, jsdom env, zone.js setup              |
| Lint       | ESLint 10 + angular-eslint 21       | `npm run lint`, flat config (`eslint.config.js`)        |
| Git hooks  | Husky + lint-staged                 | Pre-commit: lint staged `.ts` and `.html` files         |
| Storybook  | 10.x                                | `npm run storybook` → `ng run storybook-host:storybook` |
| Styles     | SCSS                                | Component-scoped, CSS custom property tokens            |

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
    // variant / state host classes via signal expressions:
    "[class.ui-<name>--<variant>]": "variant() === '<variant>'",
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

---

## Access Modifiers

Every method and field in **every** class **must** have an explicit access
modifier (`public`, `protected`, or `private`). Never rely on TypeScript's
implicit `public`. This applies to constructors as well (`public constructor`,
`protected constructor`, `private constructor`).

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
  private log(msg: string): void {
    console.log(msg);
  }
}
```

---

## CSS / SCSS Conventions

### Token namespaces

| Namespace        | Scope                            | Examples                                                                  |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `--tv-*`         | Component-level design tokens    | `--tv-text`, `--tv-border`, `--tv-accent`, `--tv-surface`, `--tv-font`    |
| `--theredhead-*` | Global theme tokens (Material 3) | `--theredhead-background`, `--theredhead-primary`, `--theredhead-surface` |
| `--ui-*`         | Density tokens                   | `--ui-density`, `--ui-control-height`, `--ui-gap`, `--ui-radius`          |

### Dark mode (three-tier pattern — use in every component)

```scss
// 1. Light defaults
:host {
  --tv-text: #1d232b;
  --tv-border: #d7dce2;
}

// 2. Explicit dark class
:host-context(html.dark-theme) {
  --tv-text: #f2f6fb;
  --tv-border: #3a3f47;
}

// 3. System preference fallback
@media (prefers-color-scheme: dark) {
  :host-context(html:not(.light-theme):not(.dark-theme)) {
    --tv-text: #f2f6fb;
    --tv-border: #3a3f47;
  }
}
```

### Selectors

- Host element variant/state classes: `ui-<name>--<variant>` (BEM-like)
- Inner element classes: plain descriptive names (`.ac-chip`, `.table-cell`, `.badge-cell`)

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
        expect(fixture.nativeElement.classList).toContain(
          `ui-button--${variant}`,
        );
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

- **Title hierarchy:** `@Theredhead/<Package>/<Component>` (e.g. `@Theredhead/UI Kit/Button`)
- **Tags:** always include `["autodocs"]`
- **Story type:** `StoryObj` with `render()` returning `{ template, props }`
- **argTypes:** use `satisfies` on options arrays for type safety
- **Complex demos:** create standalone wrapper `@Component` classes in the stories file,
  register them in the meta-level `moduleMetadata` decorator (never inside `render()`)

```ts
const meta: Meta<UIButton> = {
  title: "@Theredhead/UI Kit/Button",
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
