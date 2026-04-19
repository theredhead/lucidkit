# Text Template Processor — User Guide

`TextTemplateProcessor` is a lightweight, zero-dependency text templating
engine. Feed it a template string and a plain JavaScript object; it gives you
back the fully-rendered result.

---

## Quick start

```ts
import { TextTemplateProcessor } from "@theredhead/lucid-foundation";

const proc = new TextTemplateProcessor();

const result = proc.expand(
  "Hello, {{ firstName }}! Your order {{ orderId }} is on its way.",
  { firstName: "Alice", orderId: "ORD-4201" },
);
// → 'Hello, Alice! Your order ORD-4201 is on its way.'
```

---

## Template syntax

### Substitution — `{{ key }}`

Any key wrapped in double curly braces is replaced with the matching value
from the context. Whitespace inside the braces is ignored, so `{{key}}` and
`{{ key }}` are identical.

```
Dear {{ fullName }},
Your account reference is {{ accountRef }}.
```

**Value rules**
| Context value | Output |
| --- | --- |
| `string` | the string as-is |
| `number`, `boolean` | converted with `String()` |
| `null` or `undefined` | empty string |
| key not present | see [Missing keys](#missing-keys) |

---

### Conditional block — `{{ @if key }} … {{ @endif }}`

Renders its body only when the named key is _truthy_. Truthiness follows
standard JavaScript rules, with one extra convention: an **empty array is
falsy**, a non-empty array is truthy.

```
{{ @if isPremium }}
Thank you for being a Premium member, {{ firstName }}!
{{ @endif }}
```

Blocks can be nested to any depth:

```
{{ @if isAdmin }}
  Admin console enabled.
  {{ @if hasPendingReviews }}
    You have {{ pendingCount }} items awaiting review.
  {{ @endif }}
{{ @endif }}
```

---

### Loop block — `{{ @loop arrayKey }} … {{ @endloop }}`

Iterates over an array. Each element becomes the local context for one
iteration, so its properties can be referenced directly by name.

```
| Description | Qty | Unit Price | Total |
| :--- | ---: | ---: | ---: |
{{ @loop lines }}
| {{ description }} | {{ quantity }} | {{ unitPrice }} | {{ lineTotal }} |
{{ @endloop }}
```

**Scalar elements** (strings, numbers, …) are automatically wrapped as
`{ value: element }`, so reference them with `{{ value }}`:

```
Tags: {{ @loop tags }}{{ value }} {{ @endloop }}
```

**Loops can be nested**:

```
{{ @loop sections }}
## {{ title }}
{{ @loop items }}- {{ name }}{{ @endloop }}
{{ @endloop }}
```

---

### Standalone directives — `{{ @name arg }}`

Any registered directive can be used _without_ a close tag when it does not
need a body. The handler receives an empty string for the body parameter.

```
{{ @today }}
{{ @avatar userId }}
```

See [Custom directives](#custom-directives) below for how to register one.

---

## Missing keys

Control what happens when a `{{ key }}` token has no matching value in the
context by passing `missingKey` to the constructor:

```ts
new TextTemplateProcessor({ missingKey: "keep" }); // default — leave {{key}} as-is
new TextTemplateProcessor({ missingKey: "empty" }); // replace with ""
new TextTemplateProcessor({ missingKey: "error" }); // throw RangeError
new TextTemplateProcessor({ missingKey: (key) => `[MISSING: ${key}]` });
```

---

## Custom directives

Create an object implementing `ITextTemplateDirective` and register it with
`registerTextTemplateDirective`. All processor instances share the same
registry, so register once at application startup.

### Block directive (requires close tag)

```ts
import { registerTextTemplateDirective } from "@theredhead/lucid-foundation";

registerTextTemplateDirective("upper", {
  isSelfClosing: () => false,
  handle: (arg, body, ctx, processor) =>
    processor.expand(body, ctx).toUpperCase(),
});
// Usage:  {{ @upper }}Hello, {{ name }}{{ @endupper }}
```

The processor throws a `SyntaxError` if the close tag is missing.

### Standalone directive (no close tag)

```ts
registerTextTemplateDirective("today", {
  isSelfClosing: () => true,
  handle: () => new Date().toLocaleDateString(),
});
// Usage:  Generated on: {{ @today }}
```

### Removing a directive

```ts
import { unregisterTextTemplateDirective } from "@theredhead/lucid-foundation";

unregisterTextTemplateDirective("upper");
```

### The `ITextTemplateDirective` interface

```ts
interface ITextTemplateDirective {
  // Returns true for standalone (no close tag); false for block
  isSelfClosing(): boolean;

  handle(
    arg: string, // text after the directive name (trimmed)
    body: string, // raw content between open and close tags
    context: Record<string, unknown>, // current expansion context
    processor: ITextTemplateProcessor, // call processor.expand(body, ctx) to recurse
  ): string;
}
```

> **Always call `processor.expand(body, ctx)` inside `handle`** — the raw
> body is not yet expanded.

---

## Full example — personalised invoice

```ts
const proc = new TextTemplateProcessor({ missingKey: "empty" });

const template = `
**{{ fullName }}**
{{ addressLine1 }}
{{ addressLine2 }}

# Invoice {{ invoiceNumber }}
**Due:** {{ dueDate }}

| Description | Qty | Unit Price | Total |
| :--- | ---: | ---: | ---: |
{{ @loop lines }}| {{ description }} | {{ quantity }} | {{ unitPrice }} | {{ lineTotal }} |
{{ @endloop }}
**Total due: {{ totalIncVat }}**

{{ @if hasNote }}Note: {{ note }}{{ @endif }}
`;

const context = {
  fullName: "Alice Hartwell",
  addressLine1: "14 Maple Street",
  addressLine2: "Brighton BN1 4JT",
  invoiceNumber: "INV-2026-0041",
  dueDate: "18 May 2026",
  lines: [
    {
      description: "Professional License",
      quantity: "1",
      unitPrice: "£249.00",
      lineTotal: "£249.00",
    },
    {
      description: "Priority Support",
      quantity: "1",
      unitPrice: "£49.00",
      lineTotal: "£49.00",
    },
  ],
  totalIncVat: "£357.60",
  hasNote: false,
  note: "",
};

const output = proc.expand(template, context);
```
