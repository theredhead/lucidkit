# ADR-0010: JSON-Driven Form Engine with Visual Designer

## Status

Accepted

## Context

Building forms in Angular typically involves either:

- **Template-driven forms:** Quick to write but hard to generate dynamically.
- **Reactive forms:** Powerful but require imperative TypeScript code for every
  field. Not suitable for runtime-defined forms.

Several use cases require forms to be **defined at runtime** from a data schema:
admin panels, configurable surveys, CMS field editors, workflow builders. A
JSON-serialisable form definition enables:

- Storing form layouts in a database.
- Generating forms from API metadata.
- Visual drag-and-drop form design.

## Decision

The `@theredhead/ui-forms` package provides a **JSON-driven form engine**:

### Schema model

```ts
interface FormSchema {
  fields: FormFieldDefinition[];
  groups?: FormGroupDefinition[];
}

interface FormFieldDefinition {
  key: string;
  type: string; // 'text' | 'email' | 'number' | 'select' | …
  label: string;
  validators?: ValidationRule[];
  conditions?: Condition[];
  options?: SelectOption[]; // for select/radio fields
  adapter?: string; // text adapter key
}
```

### Rendering pipeline

1. `UIForm` receives a `FormSchema` input.
2. `FormEngine` creates signal-based `FieldState` / `GroupState` for each
   field.
3. `UIFormField` components are rendered dynamically based on the `type`
   string.
4. The `FormFieldRegistry` maps type strings to Angular component classes.
5. Consumers can register custom field types via `provideFormFields()`.

### Validation

- Declarative `ValidationRule` objects in the schema.
- Built-in validators: required, minLength, maxLength, pattern, email.
- Custom validators via `registerCustomValidator(id, fn)`.
- Signal-driven error state — errors update reactively as the user types.

### Conditional logic

- `Condition` / `ConditionGroup` objects describe when fields are visible or
  disabled.
- `evaluateCondition()` runs against current form values.

### Visual designer

- `UIFormDesigner` provides a drag-and-drop canvas for building form schemas.
- `UIFieldPalette` offers available field types.
- `UIPropertyInspector` configures the selected field.
- Export strategies: `JsonExportStrategy` (serialise schema) and
  `AngularComponentExportStrategy` (generate TypeScript code).

## Consequences

### Positive

- **Runtime flexibility:** Forms can be defined, stored, and modified without
  recompilation.
- **Schema portability:** JSON schemas can be shared across frontend and backend
  for validation consistency.
- **Visual editing:** Non-developers can build forms using the designer.
- **Extensible:** Custom field types integrate via a DI-based registry.

### Negative

- **Complexity:** The form engine is a substantial subsystem with its own state
  management, validation pipeline, and rendering layer.
- **Type safety at schema level:** JSON schemas are validated at runtime, not
  compile time. A malformed schema produces runtime errors rather than TypeScript
  compile errors.
- **Proof-of-concept scope:** The designer and export strategies are
  demonstrative — they do not yet cover every edge case a production form
  builder would need.
