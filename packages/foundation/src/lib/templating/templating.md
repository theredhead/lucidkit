# XML Block Template Processor

`TextTemplateProcessor` is an XML-only block templating engine. Every dynamic
construct is a block, including replacements:

```ts
import { TextTemplateProcessor } from "@theredhead/lucid-foundation";

const proc = new TextTemplateProcessor();
const result = proc.expand(
  'Hello, <placeholder key="firstName" />!',
  { firstName: "Alice" },
);
// "Hello, Alice!"
```

## Syntax

### Replacement block

```xml
Dear <placeholder key="fullName" />,
```

`<placeholder />` is just the built-in self-closing block provider. Missing
keys use the processor's `missingKey` option.

### Conditional block

```xml
<if test="isPremium">
  Thank you, <placeholder key="firstName" />.
</if>
```

The `test` attribute is looked up in the context. Empty arrays are falsy.

### Loop block

```xml
<loop items="lines">
  <placeholder key="description" />: <placeholder key="lineTotal" />
</loop>
```

The `items` attribute must resolve to an array. Object items are merged over
the outer context. Scalar items are exposed as `value`.

## Custom Blocks

Register a provider at application startup:

```ts
import { registerTextTemplateBlockProvider } from "@theredhead/lucid-foundation";

registerTextTemplateBlockProvider({
  name: "upper",
  contentModel: "container",
  expand: (block, context) =>
    context.processor
      .expandNodes(block.children, context.data)
      .toUpperCase(),
});
```

Usage:

```xml
<upper>Hello <placeholder key="name" /></upper>
```

All expansion goes through the block provider registry. Unknown XML blocks
throw unless a provider is registered. Common XML-compatible rich text tags
such as `<section>`, `<p>`, `<strong>`, and `<table>` are registered as
pass-through blocks so template blocks can be embedded inside rich content.
