# Text Template Processor — Developer Reference

Internal architecture notes for contributors working on or extending the
`templating` module.

---

## File map

```
packages/foundation/src/lib/templating/
  template-processor.ts       implementation + exported types
  template-processor.spec.ts  Vitest unit tests (62 tests)
  index.ts                    named barrel exports
  templating.md               end-user guide
  templating.dev.md           this file
```

Public API is re-exported from `packages/foundation/src/public-api.ts` via
`export * from "./lib/templating"`.

---

## Exported surface

| Name                                  | Kind        | Purpose                              |
| ------------------------------------- | ----------- | ------------------------------------ |
| `TextTemplateProcessor`               | `class`     | Main implementation                  |
| `ITextTemplateProcessor`              | `interface` | Contract (for DI / mocking)          |
| `ITextTemplateDirective`              | `interface` | Directive contract                   |
| `TextTemplateOptions`                 | `interface` | Constructor options                  |
| `MissingKeyBehavior`                  | `type`      | `'keep' \| 'empty' \| 'error' \| fn` |
| `registerTextTemplateDirective`       | `function`  | Register a named directive           |
| `unregisterTextTemplateDirective`     | `function`  | Remove a directive by key            |
| `haveRegisteredTextTemplateDirective` | `function`  | Check if a key is registered         |
| `getRegisteredTextTemplateDirectives` | `function`  | Get all registered directives        |

---

## How `expand()` works

```
expand(template, context)
  │
  ├─ Scan left-to-right with OPEN_TAG_RE  (matches {{ @name arg }})
  │    │
  │    ├─ For each match:
  │    │    ├─ Look up directive in _registry
  │    │    │    not found → throw RangeError
  │    │    │
  │    │    ├─ directive.isSelfClosing()?
  │    │    │    yes → processBlock(name, arg, "", ctx)
  │    │    │
  │    │    └─ block:
  │    │         findMatchingCloseTag(template, name, afterOpenTag)
  │    │           └─ depth-counting scan with per-name RegExp
  │    │
  │    │         close found  → processBlock(name, arg, rawBody, ctx)
  │    │                          handler calls expand(rawBody, innerCtx)
  │    │
  │    │         no close tag → throw SyntaxError (names expected close tag)
  │    │
  │    └─ advance pos past the close tag (or past the open tag if standalone)
  │
  └─ After all directives: replace IDENTIFIER_RE with processIdentifier()
```

### Why a manual scan loop instead of `String.replace` + regex?

`String.replace` with a non-greedy regex (`[\s\S]*?`) fails for **same-type
nested blocks**: the first `{{ @endif }}` it encounters closes the outermost
`{{ @if }}`, even when a nested one is in between.

The manual loop calls `findMatchingCloseTag` which increments a `depth`
counter every time it sees another open tag of the **same name** and
decrements on a close tag. The first time `depth` reaches 0 is the correct
matching close.

### Re-entrancy

`processBlock` (and therefore any `ITextTemplateDirective.handle`) receives
the **raw, unexpanded** body. Handlers that need it expanded must call
`processor.expand(body, ctx)` themselves. The built-in `@if` and `@loop`
do this. This means expansion is lazy — a falsy `@if` never processes its
body at all.

### No double-expansion

`IDENTIFIER_RE` is applied to the _output_ of the directive scan, not to the
original template. `String.replace` does not re-scan replacement strings, so a
context value that itself contains `{{key}}` will never be substituted.

---

## Directive registry

There are **two** static maps, both `public static readonly` on the class and
shared by every instance. Built-in directives are registered at module
evaluation time (bottom of `template-processor.ts`).

| Map                    | Purpose                                     | Missing close tag |
| ---------------------- | ------------------------------------------- | ----------------- |
| `directives`           | Block directives — require `{{ @endname }}` | `SyntaxError`     |
| `standaloneDirectives` | Self-closing — no close tag                 | n/a               |

`expand()` checks which map a directive belongs to **before** scanning for a
close tag. Unknown directives (in neither map) fall through to `processBlock`
which throws a `RangeError`.

### Adding a built-in directive (contributor checklist)

1. Decide whether it needs a body. Register at the **bottom** of
   `template-processor.ts`:

   ```ts
   // Block directive (body required):
   TextTemplateProcessor.directives.set("mydir", (arg, body, ctx, p) => { … });

   // Standalone directive (no body):
   TextTemplateProcessor.standaloneDirectives.set("mydir", (arg, _body, ctx) => { … });
   ```

2. Document it in `templating.md` under "Template syntax".
3. Add tests in `template-processor.spec.ts`:
   - basic operation
   - empty / null argument edge cases
   - nesting (same-type and with other directives)
   - for block directives: missing close tag throws `SyntaxError`
4. Add the directive name to the `afterEach` cleanup in **both** the
   custom-directive and standalone test suites.

---

## `MissingKeyBehavior` resolution

`processIdentifier` uses `Object.prototype.hasOwnProperty` to distinguish
"key present but null/undefined" (→ `""`) from "key absent" (→
`resolveMissing`). This avoids accidental prototype-chain lookups.

```
context has own key?
  yes → value == null ? "" : String(value)
  no  → resolveMissing(key)
          'keep'   → "{{key}}"
          'empty'  → ""
          'error'  → throw RangeError
          function → call fn(key)
```

---

## Test coverage

Run the full spec:

```sh
npx vitest run packages/foundation/src/lib/templating/template-processor.spec.ts
```

| Suite                         | Tests  |
| ----------------------------- | ------ |
| Identifier substitution       | 7      |
| Missing key behaviour         | 6      |
| `@if` / `@endif`              | 9      |
| `@loop` / `@endloop`          | 6      |
| Blocks use outer context      | 1      |
| Nesting                       | 18     |
| Unknown directive             | 2      |
| Custom directive registration | 5      |
| Standalone directives         | 8      |
| **Total**                     | **62** |

---

## Internal helpers (not exported)

| Name                                   | Purpose                                             |
| -------------------------------------- | --------------------------------------------------- |
| `escapeRegex(s)`                       | Escapes a string for literal use in `new RegExp(…)` |
| `findMatchingCloseTag(tpl, name, pos)` | Depth-counting close-tag finder                     |
| `OPEN_TAG_RE`                          | Matches `{{ @name arg }}` opening tags              |
| `IDENTIFIER_RE`                        | Matches `{{ key }}` tokens                          |
