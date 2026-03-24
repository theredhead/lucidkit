# ADR-0001: Zoneless Signal-Driven Architecture

## Status

Accepted

## Context

Angular historically relied on Zone.js to intercept asynchronous operations and
trigger change detection automatically. While convenient, Zone.js adds bundle
size, can cause unnecessary change-detection cycles, and makes performance
characteristics unpredictable — especially in a component library consumed by
many different applications.

Angular 16+ introduced signal-based reactivity, and Angular 18+ made zoneless
operation viable. As a greenfield proof-of-concept library targeting Angular 21,
we had the opportunity to adopt zoneless from the start rather than migrating
later.

## Decision

The library is **fully zoneless**. We do not import or inject `NgZone` anywhere.
All change detection is driven by Angular signals and
`ChangeDetectionStrategy.OnPush`.

Specifically:

- Every component uses `ChangeDetectionStrategy.OnPush`.
- All reactive state uses `signal()`, `computed()`, and `effect()`.
- Component I/O uses `input()`, `model()`, and `output()` — never legacy
  `@Input` / `@Output` decorators.
- High-frequency DOM events (e.g. `pointermove` in sliders, colour pickers) use
  plain `addEventListener` rather than Angular template event bindings, avoiding
  the need for `NgZone.runOutsideAngular`.
- The Vitest test setup configures `zoneless: true` via
  `@analogjs/vitest-angular/setup-testbed`.

## Consequences

### Positive

- **Smaller bundle:** No Zone.js overhead for consumers.
- **Predictable change detection:** Components only re-render when their signals
  change, not on every async event.
- **Simpler mental model:** No zones, no `markForCheck()`, no `detectChanges()`
  — just signals.
- **Better performance:** Fine-grained reactivity means fewer unnecessary
  template evaluations.

### Negative

- **Consumer alignment:** Consuming applications must either also be zoneless or
  ensure their Zone.js setup does not conflict. Most Angular 21 apps support
  this, but older apps may need configuration.
- **No automatic dirty-checking:** Developers must ensure all state flows through
  signals. A plain class field mutation will not trigger a re-render.
- **Ecosystem maturity:** Some third-party Angular libraries still assume Zone.js
  is present. This library avoids such dependencies.
