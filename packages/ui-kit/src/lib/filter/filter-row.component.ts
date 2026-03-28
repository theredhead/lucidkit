import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import {
  UIAutocomplete,
  type AutocompleteDatasource,
} from "../autocomplete/autocomplete.component";
import { UIButton } from "../button/button.component";
import { UIDropdownList } from "../dropdown-list/dropdown-list.component";
import { UIInput } from "../input/input.component";
import { UISelect } from "../select/select.component";
import type { SelectOption } from "../select/select.component";
import {
  DATE_UNIT_OPTIONS,
  type FilterFieldDefinition,
  type FilterOperator,
  type FilterRule,
  isNoValueOperator,
  operatorsForType,
} from "./filter.types";
import { UISurface } from '@theredhead/foundation';

// ── Helpers ───────────────────────────────────────────────────────────

/**
 * Minimal {@link AutocompleteDatasource} that filters a flat list of
 * strings, used when the value input is in autocomplete mode (6–99
 * distinct values).
 *
 * @internal
 */
class StringListDatasource implements AutocompleteDatasource<string> {
  public constructor(private readonly items: string[]) {}

  public completeFor(query: string, selection: readonly string[]): string[] {
    const q = query.toLowerCase();
    return this.items.filter(
      (item) => item.toLowerCase().includes(q) && !selection.includes(item),
    );
  }
}

/** The three modes the value input can take. */
type ValueInputMode = "select" | "autocomplete" | "text";

/**
 * A single row inside a {@link UIFilter} predicate builder.
 *
 * Renders: **field dropdown → operator dropdown → value input(s) → remove button**.
 *
 * @internal — consumed by `UIFilter`; not intended for direct use.
 */
@Component({
  selector: "ui-filter-row",
  standalone: true,
  imports: [UISelect, UIInput, UIButton, UIAutocomplete, UIDropdownList],
  templateUrl: "./filter-row.component.html",
  styleUrl: "./filter-row.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }],
  host: { class: "ui-filter-row" },
})
export class UIFilterRow {
  // ── Inputs ──────────────────────────────────────────────────────────
  /** Available filterable fields. */
  readonly fields = input.required<FilterFieldDefinition[]>();

  /** The current rule state (immutable — changes are emitted via {@link ruleChange}). */
  readonly rule = input.required<FilterRule>();

  /**
   * Map of field key → sorted distinct string values, forwarded from
   * the parent {@link UIFilter}. Used to decide whether to render a
   * dropdown, autocomplete, or plain text input.
   */
  readonly distinctValuesMap = input<ReadonlyMap<string, string[]>>(new Map());

  // ── Outputs ─────────────────────────────────────────────────────────
  /** Emits the updated rule whenever the user changes any part of it. */
  readonly ruleChange = output<FilterRule>();

  /** Emits when the user clicks the remove button. */
  readonly remove = output<void>();

  // ── Derived state ───────────────────────────────────────────────────

  /** SelectOption list built from the field definitions. */
  protected readonly fieldOptions = computed<SelectOption[]>(() =>
    this.fields().map((f) => ({ value: f.key, label: f.label })),
  );

  /** The currently selected field definition (if any). */
  protected readonly selectedField = computed(() =>
    this.fields().find((f) => f.key === this.rule().field),
  );

  /** Operator options matching the selected field's type. */
  protected readonly operatorOptions = computed<SelectOption[]>(() => {
    const field = this.selectedField();
    return field ? operatorsForType(field.type) : [];
  });

  /** The native `<input>` type matching the selected field's type. */
  protected readonly inputType = computed<"text" | "number" | "date">(() => {
    const t = this.selectedField()?.type;
    if (t === "number") return "number";
    if (t === "date") return "date";
    return "text";
  });

  /** Whether to hide the value input (for isEmpty / isNotEmpty). */
  protected readonly hideValue = computed(() =>
    isNoValueOperator(this.rule().operator),
  );

  /** Whether the operator requires a second value (between). */
  protected readonly isBetween = computed(
    () => this.rule().operator === "between",
  );

  /** Whether the operator is the relative-date "in the last" variant. */
  protected readonly isInTheLast = computed(
    () => this.rule().operator === "inTheLast",
  );

  /** Options for the date-unit dropdown. */
  protected readonly dateUnitOptions = DATE_UNIT_OPTIONS;

  // ── Smart value-input signals ───────────────────────────────────────

  /** Distinct values for the currently selected field (empty if none). */
  protected readonly fieldDistinctValues = computed<string[]>(() => {
    const field = this.rule().field;
    return this.distinctValuesMap().get(field) ?? [];
  });

  /**
   * Determines how the value input is rendered for the standard
   * (non-between, non-inTheLast) single-value case:
   *
   * - `select` — ≤ 5 distinct values → native dropdown
   * - `autocomplete` — 6–99 distinct → type-ahead search
   * - `text` — ≥ 100 distinct or non-string field → plain input
   */
  protected readonly valueInputMode = computed<ValueInputMode>(() => {
    const field = this.selectedField();
    if (field?.type !== "string") return "text";
    const distinct = this.fieldDistinctValues();
    if (distinct.length === 0) return "text";
    if (distinct.length <= 5) return "select";
    if (distinct.length < 100) return "autocomplete";
    return "text";
  });

  /** SelectOption list for the value dropdown (select mode only). */
  protected readonly valueSelectOptions = computed<SelectOption[]>(() => {
    if (this.valueInputMode() !== "select") return [];
    return this.fieldDistinctValues().map((v) => ({ value: v, label: v }));
  });

  /** Autocomplete datasource wrapping the distinct values. */
  protected readonly autocompleteDatasource = computed(
    () => new StringListDatasource(this.fieldDistinctValues()),
  );

  // ── Event handlers ──────────────────────────────────────────────────

  protected onFieldChange(key: string): void {
    const field = this.fields().find((f) => f.key === key);
    const ops = field ? operatorsForType(field.type) : [];

    const defaultOp =
      field?.type === "string" ? "contains" : (ops[0]?.value ?? "contains");

    this.ruleChange.emit({
      ...this.rule(),
      field: key,
      operator: defaultOp as FilterOperator,
      value: "",
      valueTo: undefined,
      unit: undefined,
    });
  }

  protected onOperatorChange(op: string): void {
    const patch: Partial<FilterRule> = { operator: op as FilterOperator };
    // Reset secondary fields when switching away from specialised operators
    if (op !== "between") patch.valueTo = undefined;
    if (op !== "inTheLast") patch.unit = undefined;
    if (isNoValueOperator(op)) {
      patch.value = "";
      patch.valueTo = undefined;
    }
    this.ruleChange.emit({ ...this.rule(), ...patch });
  }

  protected onValueChange(value: string): void {
    this.ruleChange.emit({ ...this.rule(), value });
  }

  protected onValueToChange(valueTo: string): void {
    this.ruleChange.emit({ ...this.rule(), valueTo });
  }

  protected onUnitChange(unit: string): void {
    this.ruleChange.emit({
      ...this.rule(),
      unit: unit as FilterRule["unit"],
    });
  }
}
