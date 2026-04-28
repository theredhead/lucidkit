import type { Predicate } from "@angular/core";

import type { CompiledFilter } from "../core/types/filter";
import type {
  DateUnit,
  FilterExpression,
  FilterFieldDefinition,
  FilterFieldType,
  FilterRule,
} from "./filter.types";
import { ANY_FIELD_KEY } from "./filter.types";

// ---------------------------------------------------------------------------
// Internal predicate builders
// ---------------------------------------------------------------------------

function buildStringPredicate(rule: FilterRule): Predicate<unknown> {
  const v = (rule.value ?? "").toLowerCase();

  switch (rule.operator) {
    case "contains":
      return (s) =>
        String(s ?? "")
          .toLowerCase()
          .includes(v);
    case "notContains":
      return (s) =>
        !String(s ?? "")
          .toLowerCase()
          .includes(v);
    case "equals":
      return (s) => String(s ?? "").toLowerCase() === v;
    case "notEquals":
      return (s) => String(s ?? "").toLowerCase() !== v;
    case "startsWith":
      return (s) =>
        String(s ?? "")
          .toLowerCase()
          .startsWith(v);
    case "endsWith":
      return (s) =>
        String(s ?? "")
          .toLowerCase()
          .endsWith(v);
    case "isEmpty":
      return (s) => s == null || String(s).trim() === "";
    case "isNotEmpty":
      return (s) => s != null && String(s).trim() !== "";
    default:
      return () => true;
  }
}

function buildNumberPredicate(rule: FilterRule): Predicate<unknown> {
  const v = parseFloat(rule.value);

  switch (rule.operator) {
    case "equals":
      return (n) => Number(n) === v;
    case "notEquals":
      return (n) => Number(n) !== v;
    case "greaterThan":
      return (n) => Number(n) > v;
    case "greaterThanOrEqual":
      return (n) => Number(n) >= v;
    case "lessThan":
      return (n) => Number(n) < v;
    case "lessThanOrEqual":
      return (n) => Number(n) <= v;
    case "between": {
      const hi = parseFloat(rule.valueTo ?? "");
      return (n) => {
        const num = Number(n);
        return num >= v && num <= hi;
      };
    }
    case "isEmpty":
      return (n) => n == null || n === "";
    case "isNotEmpty":
      return (n) => n != null && n !== "";
    default:
      return () => true;
  }
}

function subtractDateUnit(amount: number, unit: DateUnit): Date {
  const d = new Date();
  switch (unit) {
    case "days":
      d.setDate(d.getDate() - amount);
      break;
    case "weeks":
      d.setDate(d.getDate() - amount * 7);
      break;
    case "months":
      d.setMonth(d.getMonth() - amount);
      break;
    case "years":
      d.setFullYear(d.getFullYear() - amount);
      break;
  }
  return d;
}

function toDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function buildDatePredicate(rule: FilterRule): Predicate<unknown> {
  switch (rule.operator) {
    case "equals": {
      const target = rule.value;
      return (d) => {
        const date = toDate(d);
        return date != null && date.toISOString().slice(0, 10) === target;
      };
    }
    case "before": {
      const target = new Date(rule.value);
      return (d) => {
        const date = toDate(d);
        return date != null && date < target;
      };
    }
    case "after": {
      const target = new Date(rule.value);
      return (d) => {
        const date = toDate(d);
        return date != null && date > target;
      };
    }
    case "between": {
      const lo = new Date(rule.value);
      const hi = new Date(rule.valueTo ?? "");
      return (d) => {
        const date = toDate(d);
        return date != null && date >= lo && date <= hi;
      };
    }
    case "inTheLast": {
      const amount = parseInt(rule.value, 10);
      const unit = rule.unit ?? "days";
      const threshold = subtractDateUnit(amount, unit);
      return (d) => {
        const date = toDate(d);
        return date != null && date >= threshold;
      };
    }
    case "isEmpty":
      return (d) => d == null || d === "";
    case "isNotEmpty":
      return (d) => d != null && d !== "";
    default:
      return () => true;
  }
}

function buildPredicate(
  rule: FilterRule,
  fieldType: FilterFieldType,
): Predicate<unknown> {
  switch (fieldType) {
    case "string":
      return buildStringPredicate(rule);
    case "number":
      return buildNumberPredicate(rule);
    case "date":
      return buildDatePredicate(rule);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts a {@link FilterExpression} into a single `Predicate<T>`
 * for internal bridging or predicate-based consumers.
 *
 * - **AND** junction → all rules must match.
 * - **OR** junction → at least one rule must match.
 * - Empty / invalid rules are silently skipped.
 * - Returns `undefined` when no valid rules remain (= show all rows).
 *
 * @param descriptor - The structured filter state emitted by `UIFilter`.
 * @param fields     - The field definitions (needed to resolve types).
 */
export function toPredicate<T>(
  descriptor: FilterExpression<T>,
  fields: FilterFieldDefinition<T>[],
): Predicate<T> | undefined {
  const fieldMap = new Map<string, FilterFieldDefinition<T>>(
    fields.map((f) => [f.key, f]),
  );
  const validRules = descriptor.rules.filter(
    (r) => r.field && (r.field === ANY_FIELD_KEY || fieldMap.has(r.field)),
  );

  if (validRules.length === 0) return undefined;

  const tests = validRules.map((r) => {
    if (r.field === ANY_FIELD_KEY) {
      // "Any field" — test as string against every value in the row
      const test = buildStringPredicate(r);
      return (row: T) => {
        const record = row as Record<string, unknown>;
        return Object.values(record).some((val) => test(String(val ?? "")));
      };
    }
    const field = fieldMap.get(r.field)!;
    const test = buildPredicate(r, field.type);
    return (row: T) => test((row as Record<string, unknown>)[r.field]);
  });

  if (descriptor.junction === "and") {
    return ((row: T) => tests.every((t) => t(row))) as Predicate<T>;
  }

  return ((row: T) => tests.some((t) => t(row))) as Predicate<T>;
}

/**
 * Converts a {@link FilterExpression} into a {@link CompiledFilter}
 * for internal bridging to lower-level predicate-based datasource APIs.
 *
 * - **AND** junction → one property-level predicate per rule.
 * - **OR** junction → a single row-level predicate that passes when
 *   *any* rule matches.
 *
 * @param descriptor - The structured filter state emitted by `UIFilter`.
 * @param fields     - The field definitions (needed to resolve types).
 */
export function toFilterExpression<T>(
  descriptor: FilterExpression<T>,
  fields: FilterFieldDefinition<T>[],
): CompiledFilter<T> {
  const fieldMap = new Map<string, FilterFieldDefinition<T>>(
    fields.map((f) => [f.key, f]),
  );
  const validRules = descriptor.rules.filter(
    (r) => r.field && (r.field === ANY_FIELD_KEY || fieldMap.has(r.field)),
  );

  if (validRules.length === 0) return [];

  /**
   * Builds a row-level test for a single rule, handling both
   * "Any field" (string match across all values) and regular
   * property-level rules.
   */
  function buildRowTest(r: FilterRule): (row: T) => boolean {
    if (r.field === ANY_FIELD_KEY) {
      const test = buildStringPredicate(r);
      return (row: T) => {
        const record = row as Record<string, unknown>;
        return Object.values(record).some((val) => test(String(val ?? "")));
      };
    }
    const field = fieldMap.get(r.field)!;
    const test = buildPredicate(r, field.type);
    return (row: T) => test((row as Record<string, unknown>)[r.field]);
  }

  if (descriptor.junction === "and") {
    // "Any field" rules become row-level predicates; others stay property-level
    const entries: CompiledFilter<T> = [];
    for (const r of validRules) {
      if (r.field === ANY_FIELD_KEY) {
        entries.push({ predicate: buildRowTest(r) as Predicate<T> });
      } else {
        const field = fieldMap.get(r.field)!;
        entries.push({
          property: r.field as keyof T & string,
          predicate: buildPredicate(r, field.type) as Predicate<T[keyof T]>,
        });
      }
    }
    return entries;
  }

  // OR → single row-level predicate
  const rowTests = validRules.map((r) => buildRowTest(r));

  return [
    {
      predicate: ((row: T) => rowTests.some((t) => t(row))) as Predicate<T>,
    },
  ];
}
