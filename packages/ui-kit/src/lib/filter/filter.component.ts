import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  type Predicate,
} from "@angular/core";

import { UIButton } from "../button/button.component";
import { UISelect } from "../select/select.component";
import type { SelectOption } from "../select/select.component";
import { UIFilterRow } from "./filter-row.component";
import type {
  FilterDescriptor,
  FilterFieldDefinition,
  FilterJunction,
  FilterOperator,
  FilterRule,
} from "./filter.types";
import { operatorsForType } from "./filter.types";
import { toPredicate } from "./filter.utils";

const JUNCTION_OPTIONS: SelectOption[] = [
  { value: "and", label: "all" },
  { value: "or", label: "any" },
];

/**
 * Predicate builder — lets the user compose filter rules against
 * typed fields, similar to the macOS Finder "Smart Folder" editor.
 *
 * ### Basic usage
 * ```html
 * <ui-filter [fields]="fields" [(value)]="descriptor" />
 * ```
 *
 * ### Two-way binding
 * The component exposes a `model()` signal named `value`.
 * Use `[(value)]` for two-way binding or listen to `(valueChange)`.
 *
 * ### Junction mode
 * By default all rules are combined with **AND**.
 * Set `[allowJunction]="true"` to let the user switch between
 * *all* (AND) and *any* (OR).
 */
@Component({
  selector: "ui-filter",
  standalone: true,
  imports: [UISelect, UIButton, UIFilterRow],
  templateUrl: "./filter.component.html",
  styleUrl: "./filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-filter",
    role: "region",
    "aria-label": "Filter builder",
  },
})
export class UIFilter<T = any> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Filterable field definitions. */
  readonly fields = input.required<FilterFieldDefinition<T>[]>();

  /**
   * When `true` the user can toggle between *all* (AND) and *any* (OR).
   * Defaults to `false` (AND-only).
   */
  readonly allowJunction = input(false);

  /**
   * Optional raw dataset used to derive distinct values per string field.
   *
   * When provided and the total row count is below 1 000, each string
   * field's unique values are collected and forwarded to child rows so
   * they can render a dropdown (≤ 5 distinct) or autocomplete (6–99)
   * instead of a plain text input.
   */
  readonly data = input<readonly T[]>([]);

  // ── Model ───────────────────────────────────────────────────────────

  /** The complete filter state (two-way bindable). */
  readonly value = model<FilterDescriptor<T>>({
    junction: "and",
    rules: [],
  });

  /**
   * Emits a `Predicate<T>` every time the filter rules change.
   *
   * - Emits `undefined` when no valid rules remain (= show all rows).
   * - Designed to be wired directly into
   *   `FilterableArrayDatasource.applyPredicate()`.
   */
  readonly predicateChange = output<Predicate<T> | undefined>();

  constructor() {
    // Derive and emit a predicate every time the descriptor changes.
    effect(() => {
      const descriptor = this.value();
      const fields = this.fields();
      this.predicateChange.emit(toPredicate(descriptor, fields));
    });
  }

  // ── Derived state ───────────────────────────────────────────────────

  protected readonly junctionOptions = JUNCTION_OPTIONS;

  protected readonly currentJunction = computed(() => this.value().junction);

  protected readonly rules = computed(() => this.value().rules);

  /**
   * Map of field key → sorted distinct string values.
   *
   * Only populated when {@link data} has fewer than 1 000 rows.
   * Fields with ≥ 100 distinct values are omitted (plain text input).
   *
   * @internal Forwarded to child {@link UIFilterRow} instances.
   */
  protected readonly distinctValuesMap = computed(() => {
    const rows = this.data();
    const fields = this.fields();
    const map = new Map<string, string[]>();

    if (rows.length === 0 || rows.length >= 1000) return map;

    for (const field of fields) {
      if (field.type !== "string") continue;
      const values = new Set<string>();
      for (const row of rows) {
        const val = (row as Record<string, unknown>)[field.key];
        if (val != null && String(val).trim() !== "") {
          values.add(String(val));
        }
      }
      map.set(field.key, [...values].sort());
    }

    return map;
  });

  // ── Actions ─────────────────────────────────────────────────────────

  /** Adds a new empty rule using the first available field. */
  addRule(): void {
    const current = this.value();
    const defaultField = this.fields()[0];
    const ops = defaultField ? operatorsForType(defaultField.type) : [];
    const maxId = current.rules.reduce((m, r) => Math.max(m, r.id), 0);

    // Default to 'equals' when distinct values exist (select / autocomplete mode)
    const distinct = defaultField
      ? this.distinctValuesMap().get(defaultField.key)
      : undefined;
    const defaultOp =
      defaultField?.type === "string" && distinct && distinct.length > 0
        ? "equals"
        : (ops[0]?.value ?? "equals");

    const rule: FilterRule = {
      id: maxId + 1,
      field: defaultField?.key ?? "",
      operator: defaultOp as FilterOperator,
      value: "",
    };

    this.value.set({
      ...current,
      rules: [...current.rules, rule],
    });
  }

  /** Removes the rule at the given index. */
  removeRule(index: number): void {
    const current = this.value();
    this.value.set({
      ...current,
      rules: current.rules.filter((_, i) => i !== index),
    });
  }

  /** Replaces a single rule (called by child rows on edit). */
  updateRule(index: number, rule: FilterRule): void {
    const current = this.value();
    const rules = [...current.rules];
    rules[index] = rule;
    this.value.set({ ...current, rules });
  }

  /** Changes the junction mode. */
  setJunction(junction: string): void {
    this.value.set({
      ...this.value(),
      junction: junction as FilterJunction,
    });
  }
}
