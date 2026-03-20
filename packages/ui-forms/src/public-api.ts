/*
 * Public API Surface of @theredhead/ui-forms
 */

// ── Types ────────────────────────────────────────────────────────────
export type {
  ConditionOperator,
  FieldCondition,
  ConditionGroup,
  Condition,
} from "./lib/types";
export { isConditionGroup } from "./lib/types";

export type {
  ValidationRuleType,
  ValidationRule,
  ValidationError,
  ValidationResult,
} from "./lib/types";

export type {
  FormFieldOption,
  FormFieldDefinition,
  FormGroupDefinition,
  FormSchema,
  FormValues,
} from "./lib/types";

// ── Validation ───────────────────────────────────────────────────────
export {
  type ValidatorFn,
  registerCustomValidator,
  validate,
} from "./lib/validation";

// ── Engine ───────────────────────────────────────────────────────────
export { evaluateCondition } from "./lib/engine";
export { FormEngine, type FieldState, type GroupState } from "./lib/engine";

// ── Registry ─────────────────────────────────────────────────────────
export {
  type FormFieldRegistration,
  FORM_FIELD_REGISTRATIONS,
  provideFormFields,
  FormFieldRegistry,
} from "./lib/registry";
export { BUILT_IN_FIELDS, provideBuiltInFormFields } from "./lib/registry";

// ── Components ───────────────────────────────────────────────────────
export { UIFormField } from "./lib/components";
export { UIFormGroup } from "./lib/components";
export { UIForm } from "./lib/components";
export { UIFormWizard } from "./lib/components";
// ── Designer ─────────────────────────────────────────────────────
export {
  FormDesignerEngine,
  type MutableFieldDefinition,
  type MutableGroupDefinition,
  type DesignerSelection,
  type DesignerSelectionKind,
  UIFieldPalette,
  type PaletteFieldType,
  UIDesignerCanvas,
  UIPropertyInspector,
  UIFormDesigner,
} from "./lib/components";
