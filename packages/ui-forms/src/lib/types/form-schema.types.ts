// ── Form schema types ────────────────────────────────────────────────

import type { Condition } from "./condition.types";
import type { ValidationRule } from "./validation.types";

/**
 * An option for select / radio / autocomplete fields.
 *
 * @example
 * ```json
 * { "label": "Netherlands", "value": "NL" }
 * ```
 */
export interface FormFieldOption {
  readonly label: string;
  readonly value: unknown;

  /** Whether the option is disabled. */
  readonly disabled?: boolean;
}

/**
 * Definition of a single form field. Fully JSON-serializable.
 *
 * The `component` key is resolved at runtime through the
 * {@link FormFieldRegistry} to an actual Angular component that
 * exposes a two-way `value` (or mapped model) signal.
 *
 * @example
 * ```json
 * {
 *   "id": "email",
 *   "title": "E-mail address",
 *   "component": "text",
 *   "config": { "type": "email", "placeholder": "you@example.com" },
 *   "validation": [
 *     { "type": "required", "message": "E-mail is required." },
 *     { "type": "email", "message": "Enter a valid e-mail address." }
 *   ]
 * }
 * ```
 */
export interface FormFieldDefinition {

  /** Unique ID — used as the key in the form values object. */
  readonly id: string;

  /** Human-readable label shown above the field. */
  readonly title: string;

  /** Optional helper text shown below the field. */
  readonly description?: string;

  /**
   * Registry key that maps to an Angular component.
   *
   * Built-in keys: `"text"`, `"select"`, `"checkbox"`, `"toggle"`,
   * `"radio"`, `"autocomplete"`, `"date"`, `"time"`, `"datetime"`,
   * `"color"`, `"slider"`, `"richtext"`, `"file"`, `"signature"`.
   */
  readonly component: string;

  /**
   * Arbitrary key–value config forwarded as inputs to the
   * resolved component. Keys must match the component's `input()`
   * signal names.
   */
  readonly config?: Readonly<Record<string, unknown>>;

  /**
   * Options for select, radio, and autocomplete fields.
   * Passed to the component's `options` or equivalent input.
   */
  readonly options?: readonly FormFieldOption[];

  /** Validation rules evaluated by the form engine. */
  readonly validation?: readonly ValidationRule[];

  /**
   * When set, the field is only visible if the condition is met.
   * Hidden fields are excluded from the output JSON.
   */
  readonly visibleWhen?: Condition;

  /**
   * When set, the field is disabled (non-interactive) unless the
   * condition is met.
   */
  readonly enabledWhen?: Condition;

  /** Default value used when the form is first created. */
  readonly defaultValue?: unknown;
}

/**
 * A named group of fields. Rendered as a fieldset / section, or
 * as a single step in wizard mode.
 *
 * @example
 * ```json
 * {
 *   "id": "personal",
 *   "title": "Personal information",
 *   "fields": [
 *     { "id": "firstName", "title": "First name", "component": "text" },
 *     { "id": "lastName",  "title": "Last name",  "component": "text" }
 *   ]
 * }
 * ```
 */
export interface FormGroupDefinition {

  /** Unique ID for the group. */
  readonly id: string;

  /** Group heading. */
  readonly title?: string;

  /** Optional description shown below the heading. */
  readonly description?: string;

  /** Ordered list of fields in this group. */
  readonly fields: readonly FormFieldDefinition[];

  /** Condition controlling group visibility. */
  readonly visibleWhen?: Condition;

  /** Condition controlling group enabled state. */
  readonly enabledWhen?: Condition;
}

/**
 * Top-level form schema. This is the JSON document that fully
 * describes a form — its structure, fields, validation, and
 * conditional logic.
 *
 * @example
 * ```json
 * {
 *   "id": "contact",
 *   "title": "Contact form",
 *   "groups": [
 *     {
 *       "id": "main",
 *       "title": "Your details",
 *       "fields": [
 *         { "id": "name", "title": "Name", "component": "text" },
 *         { "id": "email", "title": "E-mail", "component": "text",
 *           "config": { "type": "email" } }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export interface FormSchema {

  /** Unique form identifier. */
  readonly id: string;

  /** Form title (rendered as a heading). */
  readonly title?: string;

  /** Optional description shown below the title. */
  readonly description?: string;

  /** Ordered list of field groups. */
  readonly groups: readonly FormGroupDefinition[];
}

/**
 * The plain-object output produced by the form engine.
 *
 * Keys are field IDs, values are the current field values.
 * Only visible fields are included.
 */
export type FormValues = Record<string, unknown>;

// ── Flair helpers ───────────────────────────────────────────────────

/**
 * Known flair component keys. Flair items are purely presentational
 * elements that do not collect user input.
 */
export const FLAIR_COMPONENTS = [
  "flair:richtext",
  "flair:image",
  "flair:media",
] as const;

/** A flair component key. */
export type FlairComponent = (typeof FLAIR_COMPONENTS)[number];

/**
 * Returns `true` if the given component key is a flair (non-data)
 * component.
 */
export function isFlairComponent(
  component: string,
): component is FlairComponent {
  return (FLAIR_COMPONENTS as readonly string[]).includes(component);
}
