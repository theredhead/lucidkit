// ── Form engine ──────────────────────────────────────────────────────

import {
  computed,
  type Signal,
  signal,
  type WritableSignal,
} from "@angular/core";

import type {
  FormFieldDefinition,
  FormGroupDefinition,
  FormSchema,
  FormValues,
} from "../types/form-schema.types";
import { isFlairComponent } from "../types/form-schema.types";
import type { ValidationResult } from "../types/validation.types";
import { validate } from "../validation/validators";
import { evaluateCondition } from "./condition-evaluator";

// ── Field state ──────────────────────────────────────────────────────

/**
 * Runtime state for a single field managed by the form engine.
 */
export interface FieldState {
  /** The field definition from the schema. */
  readonly definition: FormFieldDefinition;

  /** Current value (writable signal). */
  readonly value: WritableSignal<unknown>;

  /** Whether the field is currently visible. */
  readonly visible: Signal<boolean>;

  /** Whether the field is currently enabled (interactive). */
  readonly enabled: Signal<boolean>;

  /** Live validation result. */
  readonly validation: Signal<ValidationResult>;

  /** Whether the field has been interacted with. */
  readonly touched: WritableSignal<boolean>;

  /** Whether the field has been changed from its default. */
  readonly dirty: Signal<boolean>;
}

// ── Group state ──────────────────────────────────────────────────────

/**
 * Runtime state for a field group.
 */
export interface GroupState {
  /** The group definition from the schema. */
  readonly definition: FormGroupDefinition;

  /** Runtime states for every field in this group. */
  readonly fields: readonly FieldState[];

  /** Whether the group is currently visible. */
  readonly visible: Signal<boolean>;

  /** Whether the group is currently enabled. */
  readonly enabled: Signal<boolean>;

  /** Whether every visible field in the group is valid. */
  readonly valid: Signal<boolean>;
}

// ── Form engine ──────────────────────────────────────────────────────

/**
 * Signal-based form engine. Takes a {@link FormSchema}, creates
 * reactive state for every field and group, evaluates conditions,
 * runs validation, and produces a JSON output object.
 *
 * The engine is framework-agnostic (no Angular DI required) — it
 * operates purely on signals and plain objects.
 *
 * @example
 * ```ts
 * const engine = new FormEngine(schema);
 * engine.setValue("email", "test@example.com");
 * console.log(engine.values());   // { email: "test@example.com", … }
 * console.log(engine.valid());    // true / false
 * ```
 */
export class FormEngine {
  /** All field states indexed by field ID. */
  private readonly fieldMap = new Map<string, FieldState>();

  /** Ordered group states. */
  public readonly groups: readonly GroupState[];

  /** Live snapshot of all field values (including hidden fields). */
  public readonly values: Signal<FormValues>;

  /** Whether every visible field passes validation. */
  public readonly valid: Signal<boolean>;

  /** Whether any field has been interacted with. */
  public readonly touched: Signal<boolean>;

  /** Whether any field value differs from its default. */
  public readonly dirty: Signal<boolean>;

  public constructor(public readonly schema: FormSchema) {
    // 1. Build field & group states (populates fieldMap)
    this.groups = schema.groups.map((g) => this.buildGroupState(g));

    // 2. Reactive values — computed from individual field signals
    this.values = computed(() => this.readFieldValues());

    // 3. Top-level computed signals
    this.valid = computed(() =>
      this.groups.filter((g) => g.visible()).every((g) => g.valid()),
    );

    this.touched = computed(() =>
      [...this.fieldMap.values()].some((f) => f.touched()),
    );

    this.dirty = computed(() =>
      [...this.fieldMap.values()].some((f) => f.dirty()),
    );
  }

  // ── Public API ────────────────────────────────────────────────────

  /**
   * Get the {@link FieldState} for a field by ID.
   * Throws if the field is not found.
   */
  public getField(id: string): FieldState {
    const state = this.fieldMap.get(id);
    if (!state) {
      throw new Error(`FormEngine: unknown field "${id}".`);
    }
    return state;
  }

  /** Set the value of a single field by ID. */
  public setValue(id: string, value: unknown): void {
    this.getField(id).value.set(value);
  }

  /** Mark a field as touched. */
  public markTouched(id: string): void {
    this.getField(id).touched.set(true);
  }

  /** Mark all fields as touched (e.g. on submit attempt). */
  public markAllTouched(): void {
    for (const field of this.fieldMap.values()) {
      field.touched.set(true);
    }
  }

  /**
   * Reset the form to its initial default values and clear
   * touched/dirty state.
   */
  public reset(): void {
    for (const field of this.fieldMap.values()) {
      const def =
        field.definition.defaultValue ??
        this.defaultForComponent(field.definition.component);
      field.value.set(def);
      field.touched.set(false);
    }
  }

  /**
   * Produce the JSON output — a plain object containing only
   * **visible** field values.
   */
  public output(): Signal<FormValues> {
    return computed(() => {
      const result: Record<string, unknown> = {};
      for (const group of this.groups) {
        if (!group.visible()) continue;
        for (const field of group.fields) {
          if (!field.visible()) continue;
          if (isFlairComponent(field.definition.component)) continue;
          result[field.definition.id] = field.value();
        }
      }
      return result;
    });
  }

  // ── Private helpers ───────────────────────────────────────────────

  private buildGroupState(def: FormGroupDefinition): GroupState {
    const fields = def.fields.map((f) => this.buildFieldState(f));

    const visible = def.visibleWhen
      ? computed(() =>
          evaluateCondition(def.visibleWhen!, this.readFieldValues()),
        )
      : computed(() => true);

    const enabled = def.enabledWhen
      ? computed(() =>
          evaluateCondition(def.enabledWhen!, this.readFieldValues()),
        )
      : computed(() => true);

    const valid = computed(() =>
      fields.filter((f) => f.visible()).every((f) => f.validation().valid),
    );

    return { definition: def, fields, visible, enabled, valid };
  }

  private buildFieldState(def: FormFieldDefinition): FieldState {
    const defaultVal =
      def.defaultValue ?? this.defaultForComponent(def.component);
    const value = signal<unknown>(defaultVal);

    const visible = def.visibleWhen
      ? computed(() =>
          evaluateCondition(def.visibleWhen!, this.readFieldValues()),
        )
      : computed(() => true);

    const enabled = def.enabledWhen
      ? computed(() =>
          evaluateCondition(def.enabledWhen!, this.readFieldValues()),
        )
      : computed(() => true);

    const validation = computed(() =>
      !isFlairComponent(def.component) &&
      def.validation &&
      def.validation.length > 0
        ? validate(def.validation, value())
        : { valid: true, errors: [] },
    );

    const touched = signal(false);
    const dirty = computed(() => value() !== defaultVal);

    const state: FieldState = {
      definition: def,
      value,
      visible,
      enabled,
      validation,
      touched,
      dirty,
    };

    this.fieldMap.set(def.id, state);
    return state;
  }

  /**
   * Read all current field values reactively. When called inside a
   * `computed()`, it tracks every field's value signal so the
   * computed re-evaluates whenever any field changes.
   */
  private readFieldValues(): FormValues {
    const v: Record<string, unknown> = {};
    for (const [id, field] of this.fieldMap) {
      if (isFlairComponent(field.definition.component)) continue;
      v[id] = field.value();
    }
    return v;
  }

  /**
   * Produce a sensible default value for a given component type so
   * fields without explicit `defaultValue` still have a typed zero.
   */
  private defaultForComponent(component: string): unknown {
    switch (component) {
      case "checkbox":
      case "toggle":
        return false;
      case "slider":
        return 0;
      case "date":
      case "time":
      case "datetime":
      case "color":
        return null;
      case "file":
        return [];
      case "autocomplete":
        return [];
      case "flair:richtext":
      case "flair:image":
      case "flair:media":
        return null;
      default:
        return "";
    }
  }
}
