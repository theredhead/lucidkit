# ADR-0007: Structured Logging via LoggerFactory

## Status

Accepted

## Context

Scattered `console.log` / `console.warn` / `console.error` calls across a
library codebase create several problems:

1. **No filtering:** Consumers cannot silence or redirect library logs.
2. **No context:** Log lines lack a component/class identifier, making it hard
   to trace which module produced a message.
3. **No extensibility:** Console output cannot be redirected to a telemetry
   service, file, or toast notification without monkey-patching globals.
4. **Inconsistent formatting:** Each call site formats messages differently.

## Decision

All production library code logs through `LoggerFactory` from
`@theredhead/foundation`. Direct `console.*` calls are forbidden in library
source (allowed in Storybook stories and JSDoc examples for brevity).

```ts
private readonly log = inject(LoggerFactory).createLogger('UIMyComponent');

public save(): void {
  this.log.debug('saving', [data]);
  this.log.warn('field missing', [fieldName]);
  this.log.error('save failed', [err]);
}
```

Key design points:

- **Context string:** Always the class name (e.g. `'UIRichTextEditor'`).
- **Structured args:** Additional data is passed as `unknown[]` in the second
  argument — never concatenated into the message string.
- **Pluggable strategy:** `LoggerFactory.createLogger()` accepts an optional
  `ILoggingStrategy`. The default `ConsoleLoggingStrategy` writes to the
  browser console with ISO timestamps. Consumers can provide custom strategies
  (e.g. remote telemetry, buffered logging).
- **Severity levels:** `debug`, `log`, `warn`, `error` — matching console
  methods but routed through the strategy.

## Consequences

### Positive

- **Filterable:** Consumers can provide a custom strategy that suppresses
  debug-level messages in production.
- **Traceable:** Every log line includes the class context, making diagnostics
  straightforward.
- **Extensible:** Swapping the strategy can redirect all library logging to a
  remote service, localStorage buffer, or `/dev/null`.
- **Consistent format:** All log output follows the same structure.

### Negative

- **Boilerplate:** Each class needs a one-line logger field. This is minimal
  but non-zero.
- **DI requirement:** `LoggerFactory` is injected, so logging is only available
  within Angular's injection context (constructors, field initialisers). Utility
  functions outside DI must accept a logger parameter or use a static fallback.
