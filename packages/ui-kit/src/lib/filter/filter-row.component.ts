import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";

import { UIButton } from "../button/button.component";
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
  imports: [UISelect, UIInput, UIButton],
  templateUrl: "./filter-row.component.html",
  styleUrl: "./filter-row.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-filter-row" },
})
export class UIFilterRow {
  // ── Inputs ──────────────────────────────────────────────────────────
  /** Available filterable fields. */
  readonly fields = input.required<FilterFieldDefinition[]>();

  /** The current rule state (immutable — changes are emitted via {@link ruleChange}). */
  readonly rule = input.required<FilterRule>();

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

  // ── Event handlers ──────────────────────────────────────────────────

  protected onFieldChange(key: string): void {
    const field = this.fields().find((f) => f.key === key);
    const ops = field ? operatorsForType(field.type) : [];
    this.ruleChange.emit({
      ...this.rule(),
      field: key,
      operator: (ops[0]?.value ?? "equals") as FilterOperator,
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
