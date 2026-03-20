// ── Condition types ───────────────────────────────────────────────────

/**
 * Operators available for field/group conditions.
 *
 * These compare the **live** value of a referenced field against
 * a target value to determine visibility or enabled state.
 */
export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "empty"
  | "notEmpty"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqual"
  | "lessThanOrEqual"
  | "in"
  | "notIn";

/**
 * A single condition that controls whether a field or group is
 * visible / enabled, based on the live value of another field.
 *
 * Conditions are JSON-serializable so a form schema can be stored
 * as pure JSON and restored later.
 *
 * @example
 * ```json
 * { "field": "country", "operator": "equals", "value": "NL" }
 * ```
 */
export interface FieldCondition {
  /** ID of the field whose value is evaluated. */
  readonly field: string;

  /** Comparison operator. */
  readonly operator: ConditionOperator;

  /**
   * Target value to compare against. Omitted for unary operators
   * like `"empty"` and `"notEmpty"`.
   */
  readonly value?: unknown;
}

/**
 * Logical combination of multiple conditions.
 *
 * When `mode` is `"every"` (default), **all** conditions must pass.
 * When `mode` is `"some"`, **at least one** must pass.
 */
export interface ConditionGroup {
  /** How to combine the conditions. Defaults to `"every"`. */
  readonly mode?: "every" | "some";

  /** The individual conditions to evaluate. */
  readonly conditions: readonly FieldCondition[];
}

/**
 * Either a single condition or a group of conditions.
 * Used for both visibility and enabled state.
 */
export type Condition = FieldCondition | ConditionGroup;

/**
 * Check whether a `Condition` is a `ConditionGroup` (has nested
 * `conditions` array) rather than a single `FieldCondition`.
 */
export function isConditionGroup(c: Condition): c is ConditionGroup {
  return "conditions" in c && Array.isArray(c.conditions);
}
