# ADR-0006: Signal-Only Public API Surface

## Status

Accepted

## Context

Angular provides two generations of component APIs:

- **Legacy decorators:** `@Input()`, `@Output()`, `@ViewChild()`,
  `@HostBinding()`, `@HostListener()`
- **Modern signal APIs:** `input()`, `model()`, `output()`, `viewChild()`,
  `contentChildren()`, declarative `host: {}` metadata

Mixing both in a single codebase creates inconsistency: some inputs are signals
(called with `()`), others are plain properties. Consumers must check which
style each component uses. Templates behave differently depending on the API
generation.

## Decision

The library uses **exclusively modern signal APIs**. No legacy decorators appear
in any component, directive, or pipe:

| Signal API                             | Replaces                                 | Usage                    |
| -------------------------------------- | ---------------------------------------- | ------------------------ |
| `input<T>()`                           | `@Input()`                               | Optional inputs          |
| `input.required<T>()`                  | `@Input({ required: true })`             | Required inputs          |
| `model<T>()`                           | `@Input()` + `@Output()`                 | Two-way bindings         |
| `output<T>()`                          | `@Output()`                              | Event emitters           |
| `viewChild()` / `viewChildren()`       | `@ViewChild()` / `@ViewChildren()`       | View queries             |
| `contentChild()` / `contentChildren()` | `@ContentChild()` / `@ContentChildren()` | Content queries          |
| `host: {}` metadata                    | `@HostBinding()` / `@HostListener()`     | Host element interaction |

All input/model/signal fields are declared `readonly`. Assertions in tests call
signals: `component.variant()`, not `component.variant`.

## Consequences

### Positive

- **Consistency:** Every component follows the same pattern. Consumers always
  call signals for reads and use `[prop]="value"` / `[(prop)]="signal"` for
  bindings.
- **Reactivity:** Signal inputs integrate natively with `computed()` and
  `effect()` — no manual `ngOnChanges` lifecycle hook needed.
- **Zoneless compatibility:** Signal APIs are designed for zoneless change
  detection (see ADR-0001).
- **Future-proof:** Legacy decorator APIs are on Angular's deprecation path.

### Negative

- **Angular version floor:** Consumers must use Angular 17.1+ (for signal
  inputs) or Angular 18+ (for `model()` and signal queries). This library
  targets Angular 21, so this is not a practical concern.
- **Learning curve:** Developers accustomed to legacy decorators must adapt to
  calling signals and using `fixture.componentRef.setInput()` in tests.
