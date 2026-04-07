# @theredhead/ui-forms — API Inventory

> Machine-readable inventory of all public exports.
> Referenced from the root [AGENTS.md](../../AGENTS.md).

## Components

| Name                  | File                                                          | Selector                | Description                                                                        |
| --------------------- | ------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `UIFormField`         | `src/lib/components/form-field/form-field.component.ts`       | `ui-form-field`         | Renders a single form field with dynamic component creation and validation display |
| `UIFormGroup`         | `src/lib/components/form-group.component.ts`                  | `ui-form-group`         | Renders a group of form fields as a visual fieldset                                |
| `UIForm`              | `src/lib/components/form.component.ts`                        | `ui-form`               | Top-level form rendering all groups with validation                                |
| `UIFormWizard`        | `src/lib/components/form-wizard.component.ts`                 | `ui-form-wizard`        | Form groups as wizard steps with previous/next/submit navigation                   |
| `UIFieldPalette`      | `src/lib/components/designer/field-palette.component.ts`      | `ui-field-palette`      | Palette of draggable field types for the form designer                             |
| `UIDesignerCanvas`    | `src/lib/components/designer/designer-canvas.component.ts`    | `ui-designer-canvas`    | Designer canvas showing groups/fields for selection and reordering                 |
| `UIPropertyInspector` | `src/lib/components/designer/property-inspector.component.ts` | `ui-property-inspector` | Property inspector for editing field/group/form properties                         |
| `UIFormDesigner`      | `src/lib/components/designer/form-designer.component.ts`      | `ui-form-designer`      | Full-featured form designer with palette, canvas, inspector, and preview           |

## Classes

| Name                             | File                                                  | Description                                                                               |
| -------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `FormEngine`                     | `src/lib/engine/form-engine.ts`                       | Signal-based form engine managing reactive state for all fields and groups                |
| `FormFieldRegistry`              | `src/lib/registry/field-registry.ts`                  | Injectable service resolving component keys to FormFieldRegistrations                     |
| `FormDesignerEngine`             | `src/lib/components/designer/designer-engine.ts`      | Signal-based engine maintaining mutable designer state and producing FormSchema snapshots |
| `JsonExportStrategy`             | `src/lib/export/json-export-strategy.ts`              | Exports FormSchema as formatted JSON                                                      |
| `AngularComponentExportStrategy` | `src/lib/export/angular-component-export-strategy.ts` | Exports FormSchema as a standalone Angular component                                      |

## Functions

| Name                       | File                                           | Description                                              |
| -------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `validate`                 | `src/lib/validation/validators.ts`             | Validate a value against rules, returns ValidationResult |
| `registerCustomValidator`  | `src/lib/validation/validators.ts`             | Register a custom validator by ID for use in schemas     |
| `evaluateCondition`        | `src/lib/engine/condition-evaluator.ts`        | Evaluate a Condition against current form values         |
| `provideFormFields`        | `src/lib/registry/field-registry.ts`           | Provider function to register field types                |
| `provideBuiltInFormFields` | `src/lib/registry/built-in-fields.ts`          | Provider function to register all built-in field types   |
| `resolveTextAdapter`       | `src/lib/registry/text-adapter-resolver.ts`    | Resolve a text adapter key to a TextAdapter instance     |
| `isFlairComponent`         | `src/lib/types/form-schema.types.ts`           | Type guard for flair component keys                      |
| `isConditionGroup`         | `src/lib/types/condition.types.ts`             | Type guard for ConditionGroup                            |
| `toKebabCase`              | `src/lib/export/export-strategy.ts`            | Convert title to kebab-case                              |
| `toPascalCase`             | `src/lib/export/export-strategy.ts`            | Convert title to PascalCase                              |
| `getConfigSchema`          | `src/lib/components/designer/config-schema.ts` | Get config property schemas for a component key          |

## Types & Interfaces

| Kind      | Name                     | File                                                     | Description                                                           |
| --------- | ------------------------ | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Interface | `FormSchema`             | `src/lib/types/form-schema.types.ts`                     | Top-level form schema document                                        |
| Interface | `FormFieldDefinition`    | `src/lib/types/form-schema.types.ts`                     | Definition of a single form field (JSON-serialisable)                 |
| Interface | `FormGroupDefinition`    | `src/lib/types/form-schema.types.ts`                     | Group of fields rendered as a fieldset                                |
| Type      | `FormValues`             | `src/lib/types/form-schema.types.ts`                     | Plain-object output (field IDs → values)                              |
| Interface | `FormFieldOption`        | `src/lib/types/form-schema.types.ts`                     | Option for select/radio/autocomplete fields                           |
| Type      | `FlairComponent`         | `src/lib/types/form-schema.types.ts`                     | Flair component keys (`flair:richtext`, `flair:image`, `flair:media`) |
| Interface | `ValidationRule`         | `src/lib/types/validation.types.ts`                      | Single validation rule (type, params, message)                        |
| Interface | `ValidationError`        | `src/lib/types/validation.types.ts`                      | Single validation error (type, message)                               |
| Interface | `ValidationResult`       | `src/lib/types/validation.types.ts`                      | Complete validation result (valid flag, errors)                       |
| Type      | `ValidationRuleType`     | `src/lib/types/validation.types.ts`                      | Rule identifiers (required, minLength, pattern, etc.)                 |
| Type      | `ValidatorFn`            | `src/lib/validation/validators.ts`                       | Custom validator function signature                                   |
| Type      | `ConditionOperator`      | `src/lib/types/condition.types.ts`                       | Operators for conditions (equals, contains, empty, etc.)              |
| Interface | `FieldCondition`         | `src/lib/types/condition.types.ts`                       | Condition controlling field visibility/enabled state                  |
| Interface | `ConditionGroup`         | `src/lib/types/condition.types.ts`                       | Logical combination of conditions (every / some)                      |
| Type      | `Condition`              | `src/lib/types/condition.types.ts`                       | Union of FieldCondition or ConditionGroup                             |
| Interface | `FieldState`             | `src/lib/engine/form-engine.ts`                          | Runtime state for a field (value, visible, enabled, validation)       |
| Interface | `GroupState`             | `src/lib/engine/form-engine.ts`                          | Runtime state for a group (fields, visible, enabled, valid)           |
| Interface | `FormFieldRegistration`  | `src/lib/registry/field-registry.ts`                     | How a component integrates into the form system                       |
| Type      | `ConfigTransform`        | `src/lib/registry/field-registry.ts`                     | Config value transform for component inputs                           |
| Interface | `FormSettings`           | `src/lib/components/form-settings.ts`                    | Shared settings provided by parent form                               |
| Interface | `MutableFieldDefinition` | `src/lib/components/designer/designer-engine.ts`         | Mutable counterpart of FormFieldDefinition for designer               |
| Interface | `MutableGroupDefinition` | `src/lib/components/designer/designer-engine.ts`         | Mutable counterpart of FormGroupDefinition for designer               |
| Type      | `DesignerSelectionKind`  | `src/lib/components/designer/designer-engine.ts`         | Selection kinds: field, group, form                                   |
| Interface | `DesignerSelection`      | `src/lib/components/designer/designer-engine.ts`         | Currently selected item in designer canvas                            |
| Interface | `PaletteFieldType`       | `src/lib/components/designer/field-palette.component.ts` | Metadata for a draggable field type                                   |
| Interface | `ExportResult`           | `src/lib/export/export-strategy.ts`                      | Export result (mimeType, fileName, content)                           |
| Interface | `ExportStrategy`         | `src/lib/export/export-strategy.ts`                      | Strategy for exporting FormSchema to a format                         |
| Interface | `ConfigPropertySchema`   | `src/lib/components/designer/config-schema.ts`           | Config property descriptor for the property inspector                 |

## Constants & Tokens

| Name                       | File                                        | Description                                              |
| -------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| `FLAIR_COMPONENTS`         | `src/lib/types/form-schema.types.ts`        | Array of known flair component keys                      |
| `FORM_FIELD_REGISTRATIONS` | `src/lib/registry/field-registry.ts`        | DI token for collecting field registrations              |
| `BUILT_IN_FIELDS`          | `src/lib/registry/built-in-fields.ts`       | Pre-configured field registrations for ui-kit components |
| `TEXT_ADAPTER_KEYS`        | `src/lib/registry/text-adapter-resolver.ts` | Array of all text adapter keys                           |
| `FORM_SETTINGS`            | `src/lib/components/form-settings.ts`       | DI token for FormSettings                                |
