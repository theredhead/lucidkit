import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from "@angular/core";

import type { FilterExpression } from "../core/types/filter";
import { UIButton } from "../button/button.component";
import { UIIcon } from "../icon/icon.component";
import { UIIcons } from "../icon/lucide-icons.generated";
import { UIInput } from "../input/input.component";
import { UIDropdownList } from "../dropdown-list/dropdown-list.component";
import { UISelect } from "../select/select.component";
import type { SelectOption } from "../select/select.component";
import { UIFilterRow } from "./filter-row.component";
import type {
  FilterDescriptor,
  FilterFieldDefinition,
  FilterJunction,
  FilterMode,
  FilterOperator,
  FilterRule,
} from "./filter.types";
import { ANY_FIELD_KEY } from "./filter.types";
import { toFilterExpression } from "./filter.utils";
import { UISurface, UI_DEFAULT_SURFACE_TYPE } from "@theredhead/foundation";

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
  imports: [UIDropdownList, UISelect, UIButton, UIIcon, UIInput, UIFilterRow],
  templateUrl: "./filter.component.html",
  styleUrl: "./filter.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  providers: [{ provide: UI_DEFAULT_SURFACE_TYPE, useValue: "panel" }],
  host: {
    class: "ui-filter",
    role: "region",
    "aria-label": "Filter builder",
    "[class.ui-filter--simple]": "mode() === 'simple'",
    "[class.ui-filter--advanced]": "mode() === 'advanced'",
    "[class.ui-filter--disabled]": "disabled()",
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class UIFilter<T = any> {
  // ── Inputs ──────────────────────────────────────────────────────────

  /** Whether the filter is disabled. */
  readonly disabled = input<boolean>(false);

  /** Filterable field definitions. */
  readonly fields = input.required<FilterFieldDefinition<T>[]>();

  /**
   * When `true` the user can toggle between *all* (AND) and *any* (OR).
   * Defaults to `false` (AND-only).
   */
  readonly allowJunction = input(false);

  /**
   * Whether simple mode is available. Defaults to `true`.
   *
   * Simple mode renders a single search textbox using
   * "Any field contains" logic behind the scenes.
   */
  readonly allowSimple = input(true);

  /**
   * Whether advanced mode is available. Defaults to `true`.
   *
   * Advanced mode renders the full multi-rule predicate builder.
   */
  readonly allowAdvanced = input(true);

  /**
   * Whether the simple / advanced mode toggle is hidden.
   *
   * When `true`, the component stays permanently in whichever mode
   * was resolved at init (from `allowSimple` / `allowAdvanced`).
   * The user cannot switch modes.
   */
  readonly modeLocked = input(false);

  /**
   * Whether to show a "Save Filter" button in the advanced mode header.
   *
   * When clicked, the {@link saveFilter} output emits.
   */
  readonly showSaveButton = input(false);

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
   * Emits a {@link FilterExpression} every time the filter rules change.
   *
   * - Emits an empty array when no valid rules remain (= show all rows).
   * - Designed to be wired directly into
   *   `FilterableArrayDatasource.filterBy()`.
   */
  readonly expressionChange = output<FilterExpression<T>>();

  /**
   * Emitted when the user clicks the "Save Filter" button.
   *
   * Only fires when {@link showSaveButton} is `true` and the filter
   * is in advanced mode.
   */
  readonly saveFilter = output<void>();

  // ── Mode state ──────────────────────────────────────────────────────

  /**
   * The current display mode of the filter.
   *
   * Determined automatically from `allowSimple` / `allowAdvanced`
   * on init. Toggled by the user via the mode toggle button when
   * both modes are enabled.
   */
  readonly mode = signal<FilterMode>("simple");

  /**
   * The search term used in simple mode.
   * @internal
   */
  readonly simpleQuery = signal("");

  constructor() {
    // Resolve the initial mode from allowed modes.
    effect(() => {
      const simple = this.allowSimple();
      const advanced = this.allowAdvanced();
      // First run: pick the best starting mode
      if (!simple && advanced) {
        this.mode.set("advanced");
      } else if (simple) {
        this.mode.set("simple");
      }
    });

    // Derive and emit a filter expression every time the descriptor changes.
    effect(() => {
      const descriptor = this.value();
      const fields = this.fields();
      this.expressionChange.emit(toFilterExpression(descriptor, fields));
    });

    // In simple mode, sync the search term into the descriptor.
    effect(() => {
      const m = this.mode();
      const q = this.simpleQuery();
      if (m !== "simple") return;
      this.value.set({
        junction: "and",
        rules: q.trim()
          ? [
              {
                id: 1,
                field: ANY_FIELD_KEY,
                operator: "contains" as FilterOperator,
                value: q,
              },
            ]
          : [],
      });
    });
  }

  // ── Derived state ───────────────────────────────────────────────────

  protected readonly junctionOptions = JUNCTION_OPTIONS;

  /** @internal Icon shown on the "Advanced" toggle button. */
  protected readonly advancedIcon = UIIcons.Lucide.Account.SlidersHorizontal;

  /** @internal Icon shown on the "Simple" toggle button. */
  protected readonly simpleIcon = UIIcons.Lucide.Social.Search;

  /** @internal Icon shown on the "Save Filter" button. */
  protected readonly saveIcon = UIIcons.Lucide.Files.Save;

  protected readonly currentJunction = computed(() => this.value().junction);

  protected readonly rules = computed(() => this.value().rules);

  /**
   * Whether the mode toggle button should be visible.
   * @internal
   */
  protected readonly showModeToggle = computed(
    () => this.allowSimple() && this.allowAdvanced() && !this.modeLocked(),
  );

  /**
   * The field list augmented with an "Any field" entry at the top.
   *
   * This is forwarded to child {@link UIFilterRow} instances so
   * the user can choose to search across all fields at once.
   * @internal
   */
  protected readonly augmentedFields = computed<FilterFieldDefinition[]>(() => {
    const anyField: FilterFieldDefinition = {
      key: ANY_FIELD_KEY,
      label: "Any field",
      type: "string",
    };
    return [anyField, ...this.fields()];
  });

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

  /** Adds a new empty rule defaulting to the "Any field" option. */
  addRule(): void {
    const current = this.value();
    const maxId = current.rules.reduce((m, r) => Math.max(m, r.id), 0);

    const rule: FilterRule = {
      id: maxId + 1,
      field: ANY_FIELD_KEY,
      operator: "contains",
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

  /**
   * Toggles between simple and advanced mode.
   *
   * When switching **to advanced**, if there are no rules, one empty
   * rule is added so the user sees a starting row. If the simple
   * search had text, the "Any field contains" rule is preserved.
   *
   * When switching **to simple**, the current descriptor is replaced
   * by the simple search term.
   */
  toggleMode(): void {
    if (this.mode() === "simple") {
      this.mode.set("advanced");
      // Carry over the simple search as an initial rule
      const q = this.simpleQuery().trim();
      if (q) {
        this.value.set({
          junction: "and",
          rules: [
            {
              id: 1,
              field: ANY_FIELD_KEY,
              operator: "contains" as FilterOperator,
              value: q,
            },
          ],
        });
      } else if (this.value().rules.length === 0) {
        this.addRule();
      }
    } else {
      this.mode.set("simple");
      // Try to extract a simple search term from the current rules
      const rules = this.value().rules;
      const anyContains = rules.find(
        (r) => r.field === ANY_FIELD_KEY && r.operator === "contains",
      );
      this.simpleQuery.set(anyContains?.value ?? "");
    }
  }

  /**
   * Handles the simple search input.
   * @internal
   */
  onSimpleInput(value: string): void {
    this.simpleQuery.set(value);
  }
}
