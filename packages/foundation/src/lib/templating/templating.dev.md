# XML Block Template Processor Developer Reference

## File Map

```
packages/foundation/src/lib/templating/
  template-processor.ts       implementation + exported types
  template-processor.spec.ts  Vitest unit tests
  index.ts                    named barrel exports
  templating.md               end-user guide
  templating.dev.md           this file
```

## Architecture

The processor is XML-only. It parses a fragment by wrapping it in an internal
root element, converts it to a canonical document model, then expands that
model by walking nodes left-to-right.

All dynamic constructs are `TemplateBlockNode`s. There is no special
placeholder node type:

- `<placeholder key="name" />` is a self-closing block.
- `<if test="flag">...</if>` is a container block.
- `<loop items="rows">...</loop>` is a container block.

`XmlTemplateProcessor.processBlock()` looks up the block name in the provider
registry, validates required attributes/content shape, and delegates expansion
to the provider. Custom blocks use the same path as built-ins.

## Extension Points

Use `registerTextTemplateBlockProvider()` for new blocks. A provider declares:

- `name`
- `contentModel`
- `requiredAttributes`
- `optionalAttributes`
- `expand(block, context)`

Common XML-compatible rich text tags are registered as pass-through providers.
This keeps rich HTML output on the same provider dispatch path while still
allowing template blocks inside rich text.

## Testing

Run:

```sh
npx vitest run packages/foundation/src/lib/templating/template-processor.spec.ts
```
