// ── Validation engine ────────────────────────────────────────────────

import type {
  ValidationError,
  ValidationResult,
  ValidationRule,
} from "../types/validation.types";

/**
 * Signature for a custom validator function.
 *
 * Returns `null` when valid, or a `ValidationError` on failure.
 */
export type ValidatorFn = (
  value: unknown,
  params: Readonly<Record<string, unknown>>,
) => ValidationError | null;

/** Registry of custom validators keyed by `validatorId`. */
const customValidators = new Map<string, ValidatorFn>();

/**
 * Register a custom validator that can be referenced by
 * `{ type: "custom", params: { validatorId: "myId" } }` in a
 * form schema.
 */
export function registerCustomValidator(id: string, fn: ValidatorFn): void {
  customValidators.set(id, fn);
}

// ── Built-in validator implementations ────────────────────────────────

function isEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "boolean") return !v;
  if (typeof v === "string") return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function validateRequired(
  value: unknown,
  _params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  return isEmpty(value)
    ? { type: "required", message: message ?? "This field is required." }
    : null;
}

function validateMinLength(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const min = params["min"] as number;
  if (typeof value !== "string") return null;
  return value.length < min
    ? {
        type: "minLength",
        message: message ?? `Must be at least ${min} characters.`,
      }
    : null;
}

function validateMaxLength(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const max = params["max"] as number;
  if (typeof value !== "string") return null;
  return value.length > max
    ? {
        type: "maxLength",
        message: message ?? `Must be at most ${max} characters.`,
      }
    : null;
}

function validateMin(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const min = params["min"] as number;
  if (typeof value !== "number") return null;
  return value < min
    ? { type: "min", message: message ?? `Must be at least ${min}.` }
    : null;
}

function validateMax(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const max = params["max"] as number;
  if (typeof value !== "number") return null;
  return value > max
    ? { type: "max", message: message ?? `Must be at most ${max}.` }
    : null;
}

function validatePattern(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const pattern = params["pattern"] as string;
  if (typeof value !== "string" || value.length === 0) return null;
  const re = new RegExp(pattern);
  return !re.test(value)
    ? {
        type: "pattern",
        message: message ?? `Does not match the required pattern.`,
      }
    : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(
  value: unknown,
  _params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  if (typeof value !== "string" || value.length === 0) return null;
  return !EMAIL_RE.test(value)
    ? {
        type: "email",
        message: message ?? "Enter a valid e-mail address.",
      }
    : null;
}

function validateCustom(
  value: unknown,
  params: Readonly<Record<string, unknown>>,
  message?: string,
): ValidationError | null {
  const id = params["validatorId"] as string;
  const fn = customValidators.get(id);
  if (!fn) {
    return { type: "custom", message: `Unknown validator: "${id}".` };
  }
  const result = fn(value, params);
  if (result) {
    return { ...result, message: message ?? result.message };
  }
  return null;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Run a single validation rule against a value.
 */
export function runValidator(
  rule: ValidationRule,
  value: unknown,
): ValidationError | null {
  const params = rule.params ?? {};
  switch (rule.type) {
    case "required":
      return validateRequired(value, params, rule.message);
    case "minLength":
      return validateMinLength(value, params, rule.message);
    case "maxLength":
      return validateMaxLength(value, params, rule.message);
    case "min":
      return validateMin(value, params, rule.message);
    case "max":
      return validateMax(value, params, rule.message);
    case "pattern":
      return validatePattern(value, params, rule.message);
    case "email":
      return validateEmail(value, params, rule.message);
    case "custom":
      return validateCustom(value, params, rule.message);
    default:
      return null;
  }
}

/**
 * Validate a value against an array of rules and return a
 * {@link ValidationResult}.
 */
export function validate(
  rules: readonly ValidationRule[],
  value: unknown,
): ValidationResult {
  const errors: ValidationError[] = [];
  for (const rule of rules) {
    const error = runValidator(rule, value);
    if (error) {
      errors.push(error);
    }
  }
  return { valid: errors.length === 0, errors };
}
