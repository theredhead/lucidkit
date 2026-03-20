// ── Condition evaluator ───────────────────────────────────────────────

import {
  type Condition,
  type FieldCondition,
  isConditionGroup,
} from "../types/condition.types";
import type { FormValues } from "../types/form-schema.types";

/**
 * Evaluate a single {@link FieldCondition} against the current
 * form values.
 */
function evaluateFieldCondition(
  condition: FieldCondition,
  values: FormValues,
): boolean {
  const actual = values[condition.field];
  const target = condition.value;

  switch (condition.operator) {
    case "equals":
      return actual === target;
    case "notEquals":
      return actual !== target;
    case "contains":
      if (typeof actual === "string" && typeof target === "string") {
        return actual.includes(target);
      }
      if (Array.isArray(actual)) {
        return actual.includes(target);
      }
      return false;
    case "notContains":
      if (typeof actual === "string" && typeof target === "string") {
        return !actual.includes(target);
      }
      if (Array.isArray(actual)) {
        return !actual.includes(target);
      }
      return true;
    case "empty":
      return (
        actual === null ||
        actual === undefined ||
        actual === "" ||
        (Array.isArray(actual) && actual.length === 0)
      );
    case "notEmpty":
      return (
        actual !== null &&
        actual !== undefined &&
        actual !== "" &&
        !(Array.isArray(actual) && actual.length === 0)
      );
    case "greaterThan":
      return typeof actual === "number" && typeof target === "number"
        ? actual > target
        : false;
    case "lessThan":
      return typeof actual === "number" && typeof target === "number"
        ? actual < target
        : false;
    case "greaterThanOrEqual":
      return typeof actual === "number" && typeof target === "number"
        ? actual >= target
        : false;
    case "lessThanOrEqual":
      return typeof actual === "number" && typeof target === "number"
        ? actual <= target
        : false;
    case "in":
      return Array.isArray(target) ? target.includes(actual) : false;
    case "notIn":
      return Array.isArray(target) ? !target.includes(actual) : true;
    default:
      return true;
  }
}

/**
 * Evaluate a {@link Condition} (single or group) against the
 * current form values.
 *
 * @returns `true` when the condition is satisfied.
 */
export function evaluateCondition(
  condition: Condition,
  values: FormValues,
): boolean {
  if (isConditionGroup(condition)) {
    const mode = condition.mode ?? "every";
    return mode === "every"
      ? condition.conditions.every((c) => evaluateFieldCondition(c, values))
      : condition.conditions.some((c) => evaluateFieldCondition(c, values));
  }
  return evaluateFieldCondition(condition, values);
}
