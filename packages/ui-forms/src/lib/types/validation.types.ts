// ── Validation types ─────────────────────────────────────────────────

/**
 * Built-in validation rule identifiers.
 *
 * The form engine ships validators for each of these. Custom
 * validators can extend this set via the `"custom"` type.
 */
export type ValidationRuleType =
  | "required"
  | "minLength"
  | "maxLength"
  | "min"
  | "max"
  | "pattern"
  | "email"
  | "custom";

/**
 * A single validation rule, JSON-serializable.
 *
 * @example
 * ```json
 * { "type": "required", "message": "This field is required." }
 * { "type": "minLength", "params": { "min": 3 }, "message": "At least 3 characters." }
 * { "type": "pattern", "params": { "pattern": "^[A-Z]" }, "message": "Must start with uppercase." }
 * ```
 */
export interface ValidationRule {

  /** The validator to apply. */
  readonly type: ValidationRuleType;

  /**
   * Additional parameters for the validator. The shape depends on
   * the `type`:
   *
   * | Type        | Params                        |
   * |-------------|-------------------------------|
   * | required    | —                             |
   * | minLength   | `{ min: number }`             |
   * | maxLength   | `{ max: number }`             |
   * | min         | `{ min: number }`             |
   * | max         | `{ max: number }`             |
   * | pattern     | `{ pattern: string }`         |
   * | email       | —                             |
   * | custom      | `{ validatorId: string, … }`  |
   */
  readonly params?: Readonly<Record<string, unknown>>;

  /** Human-readable error message shown when the rule fails. */
  readonly message?: string;
}

/**
 * A single validation error produced by the validation engine.
 */
export interface ValidationError {

  /** The rule type that failed. */
  readonly type: string;

  /** Human-readable error message. */
  readonly message: string;
}

/**
 * Complete validation result for a single field.
 */
export interface ValidationResult {

  /** Whether all rules passed. */
  readonly valid: boolean;

  /** Errors for every failed rule (empty when valid). */
  readonly errors: readonly ValidationError[];
}
