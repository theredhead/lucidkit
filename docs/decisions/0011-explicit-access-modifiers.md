# ADR-0011: Explicit Access Modifiers on All Members

## Status

Accepted

## Context

TypeScript class members are `public` by default when no access modifier is
specified. This implicit behaviour creates ambiguity:

- Is a missing modifier intentional (`public`) or an oversight?
- Code reviewers cannot tell whether a field was meant to be part of the public
  API or is an internal implementation detail.
- Refactoring tools are less effective when they cannot distinguish intended
  public surface from accidentally exposed internals.

## Decision

**Every method and field in every class must have an explicit access modifier**
(`public`, `protected`, or `private`). This includes constructors:

```ts
export class UIExample {
  public readonly label = input<string>('');
  protected readonly state = signal(false);
  private readonly log = inject(LoggerFactory).createLogger('UIExample');

  public constructor(private readonly cdr: ChangeDetectorRef) {}

  public toggle(): void { … }
  protected reset(): void { … }
  private logMessage(msg: string): void { … }
}
```

The rule applies to all TypeScript classes: components, services, directives,
pipes, and plain utility classes.

## Consequences

### Positive

- **Intentional API surface:** Every member is explicitly marked. Reviewers and
  consumers know exactly what is public, protected, or private.
- **Safer refactoring:** Renaming or removing a `private` member is safe.
  Changing a `public` member signals a breaking change. The distinction is
  always visible.
- **Consistency:** No guessing whether a missing modifier was intentional.
  Every class follows the same convention.
- **Tooling support:** IDEs can filter by access level, making large classes
  easier to navigate.

### Negative

- **Verbosity:** Every member has an extra keyword. This is a minor cost for
  significant clarity.
- **Enforcement:** TypeScript does not enforce "no implicit public" natively.
  The rule must be maintained through code review and linting conventions.
