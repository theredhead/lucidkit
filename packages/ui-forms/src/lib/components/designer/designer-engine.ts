// ── FormDesignerEngine ───────────────────────────────────────────────

import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from "@angular/core";

import type {
  Condition,
  FormFieldDefinition,
  FormFieldOption,
  FormGroupDefinition,
  FormSchema,
  ValidationRule,
} from "../../types";

// ── Mutable wrappers ────────────────────────────────────────────────

/**
 * Mutable counterpart of {@link FormFieldDefinition} used
 * exclusively inside the designer. Signal-driven so every
 * property change is immediately reflected in the live preview
 * and schema output.
 */
export interface MutableFieldDefinition {
  readonly uid: string;
  readonly id: WritableSignal<string>;
  readonly title: WritableSignal<string>;
  readonly description: WritableSignal<string>;
  readonly component: WritableSignal<string>;
  readonly config: WritableSignal<Record<string, unknown>>;
  readonly options: WritableSignal<FormFieldOption[]>;
  readonly validation: WritableSignal<ValidationRule[]>;
  readonly visibleWhen: WritableSignal<Condition | null>;
  readonly enabledWhen: WritableSignal<Condition | null>;
  readonly defaultValue: WritableSignal<unknown>;
}

/**
 * Mutable counterpart of {@link FormGroupDefinition}.
 */
export interface MutableGroupDefinition {
  readonly uid: string;
  readonly id: WritableSignal<string>;
  readonly title: WritableSignal<string>;
  readonly description: WritableSignal<string>;
  readonly fields: WritableSignal<MutableFieldDefinition[]>;
  readonly visibleWhen: WritableSignal<Condition | null>;
  readonly enabledWhen: WritableSignal<Condition | null>;
}

// ── Selection ───────────────────────────────────────────────────────

/** What kind of item is currently selected in the designer. */
export type DesignerSelectionKind = "field" | "group" | "form";

/**
 * Describes the currently selected item in the designer canvas.
 */
export interface DesignerSelection {
  readonly kind: DesignerSelectionKind;
  readonly groupUid: string | null;
  readonly fieldUid: string | null;
}

// ── Counters for generating unique IDs ──────────────────────────────

let nextFieldId = 1;
let nextGroupId = 1;

/** @internal Reset counters (for testing). */
export function resetDesignerCounters(): void {
  nextFieldId = 1;
  nextGroupId = 1;
}

// ── Engine ──────────────────────────────────────────────────────────

/**
 * Signal-based engine that maintains the mutable designer state
 * and produces a readonly {@link FormSchema} snapshot on demand.
 *
 * All mutations go through public methods so the UI stays in sync
 * via Angular's signal-based change detection.
 *
 * @example
 * ```ts
 * const engine = new FormDesignerEngine();
 * engine.addGroup();
 * engine.addField(engine.groups()[0].uid, 'text');
 * const schema = engine.schema();
 * ```
 */
export class FormDesignerEngine {
  // ── Form-level properties ─────────────────────────────────────────

  /** Form ID. */
  public readonly formId: WritableSignal<string> = signal("form-1");

  /** Form title. */
  public readonly formTitle: WritableSignal<string> = signal("");

  /** Form description. */
  public readonly formDescription: WritableSignal<string> = signal("");

  // ── Groups ────────────────────────────────────────────────────────

  /** Ordered list of mutable group definitions. */
  public readonly groups: WritableSignal<MutableGroupDefinition[]> = signal([]);

  // ── Selection ─────────────────────────────────────────────────────

  /** Currently selected item in the canvas. */
  public readonly selection: WritableSignal<DesignerSelection | null> =
    signal(null);

  /** The currently selected mutable field (convenience). */
  public readonly selectedField: Signal<MutableFieldDefinition | null> =
    computed(() => {
      const sel = this.selection();
      if (!sel || sel.kind !== "field" || !sel.fieldUid) return null;
      for (const g of this.groups()) {
        for (const f of g.fields()) {
          if (f.uid === sel.fieldUid) return f;
        }
      }
      return null;
    });

  /** The currently selected mutable group (convenience). */
  public readonly selectedGroup: Signal<MutableGroupDefinition | null> =
    computed(() => {
      const sel = this.selection();
      if (!sel || !sel.groupUid) return null;
      return this.groups().find((g) => g.uid === sel.groupUid) ?? null;
    });

  // ── Computed schema output ────────────────────────────────────────

  /**
   * Produces a readonly {@link FormSchema} snapshot from the current
   * mutable state. Fully JSON-serializable.
   */
  public readonly schema: Signal<FormSchema> = computed(() =>
    this.buildSchema(),
  );

  // ── Group mutations ───────────────────────────────────────────────

  /** Add a new empty group at the end. Returns the new group's uid. */
  public addGroup(): string {
    const uid = crypto.randomUUID();
    const group = this.createMutableGroup(uid, `group-${nextGroupId++}`, "");
    this.groups.update((gs) => [...gs, group]);
    this.selection.set({ kind: "group", groupUid: uid, fieldUid: null });
    return uid;
  }

  /** Remove a group by uid. Clears selection if it pointed at the group. */
  public removeGroup(uid: string): void {
    this.groups.update((gs) => gs.filter((g) => g.uid !== uid));
    const sel = this.selection();
    if (sel && sel.groupUid === uid) {
      this.selection.set(null);
    }
  }

  /** Move a group to a new index. */
  public moveGroup(uid: string, newIndex: number): void {
    this.groups.update((gs) => {
      const idx = gs.findIndex((g) => g.uid === uid);
      if (idx === -1 || idx === newIndex) return gs;
      const copy = [...gs];
      const [item] = copy.splice(idx, 1);
      copy.splice(newIndex, 0, item);
      return copy;
    });
  }

  // ── Field mutations ───────────────────────────────────────────────

  /**
   * Add a new field to a group. Returns the new field's uid.
   *
   * @param groupUid — Target group
   * @param component — Field component key (e.g. `"text"`, `"select"`)
   * @param atIndex — Optional insertion index (appends if omitted)
   */
  public addField(
    groupUid: string,
    component: string,
    atIndex?: number,
  ): string {
    const group = this.groups().find((g) => g.uid === groupUid);
    if (!group) {
      throw new Error(`FormDesignerEngine: unknown group "${groupUid}".`);
    }

    const uid = crypto.randomUUID();
    const fieldId = `field_${nextFieldId++}`;
    const field = this.createMutableField(
      uid,
      fieldId,
      this.labelForComponent(component),
      component,
    );

    group.fields.update((fs) => {
      const copy = [...fs];
      if (atIndex !== undefined && atIndex >= 0 && atIndex <= copy.length) {
        copy.splice(atIndex, 0, field);
      } else {
        copy.push(field);
      }
      return copy;
    });

    this.selection.set({ kind: "field", groupUid, fieldUid: uid });
    return uid;
  }

  /** Remove a field by uid from its containing group. */
  public removeField(groupUid: string, fieldUid: string): void {
    const group = this.groups().find((g) => g.uid === groupUid);
    if (!group) return;
    group.fields.update((fs) => fs.filter((f) => f.uid !== fieldUid));

    const sel = this.selection();
    if (sel && sel.fieldUid === fieldUid) {
      this.selection.set(null);
    }
  }

  /** Move a field to a new position within its group, or to another group. */
  public moveField(
    sourceGroupUid: string,
    fieldUid: string,
    targetGroupUid: string,
    targetIndex: number,
  ): void {
    const sourceGroup = this.groups().find((g) => g.uid === sourceGroupUid);
    const targetGroup = this.groups().find((g) => g.uid === targetGroupUid);
    if (!sourceGroup || !targetGroup) return;

    let movedField: MutableFieldDefinition | undefined;

    sourceGroup.fields.update((fs) => {
      const idx = fs.findIndex((f) => f.uid === fieldUid);
      if (idx === -1) return fs;
      const copy = [...fs];
      [movedField] = copy.splice(idx, 1);
      return copy;
    });

    if (!movedField) return;

    const fieldToInsert = movedField;
    targetGroup.fields.update((fs) => {
      const copy = [...fs];
      copy.splice(Math.min(targetIndex, copy.length), 0, fieldToInsert);
      return copy;
    });
  }

  /** Duplicate a field within its group (inserted right after the original). */
  public duplicateField(groupUid: string, fieldUid: string): string | null {
    const group = this.groups().find((g) => g.uid === groupUid);
    if (!group) return null;

    const fields = group.fields();
    const original = fields.find((f) => f.uid === fieldUid);
    if (!original) return null;

    const newUid = crypto.randomUUID();
    const copy = this.createMutableField(
      newUid,
      original.id() + "_copy",
      original.title() + " (copy)",
      original.component(),
    );

    // Copy properties
    copy.description.set(original.description());
    copy.config.set({ ...original.config() });
    copy.options.set([...original.options()]);
    copy.validation.set([...original.validation()]);
    copy.visibleWhen.set(original.visibleWhen());
    copy.enabledWhen.set(original.enabledWhen());
    copy.defaultValue.set(original.defaultValue());

    const idx = fields.findIndex((f) => f.uid === fieldUid);
    group.fields.update((fs) => {
      const arr = [...fs];
      arr.splice(idx + 1, 0, copy);
      return arr;
    });

    this.selection.set({ kind: "field", groupUid, fieldUid: newUid });
    return newUid;
  }

  // ── Selection ─────────────────────────────────────────────────────

  /** Select a field for editing in the inspector. */
  public selectField(groupUid: string, fieldUid: string): void {
    this.selection.set({ kind: "field", groupUid, fieldUid });
  }

  /** Select a group for editing in the inspector. */
  public selectGroup(groupUid: string): void {
    this.selection.set({ kind: "group", groupUid, fieldUid: null });
  }

  /** Select the form-level properties for editing. */
  public selectForm(): void {
    this.selection.set({ kind: "form", groupUid: null, fieldUid: null });
  }

  /** Clear the selection. */
  public clearSelection(): void {
    this.selection.set(null);
  }

  // ── Import / Export ───────────────────────────────────────────────

  /**
   * Load an existing {@link FormSchema} into the designer,
   * replacing all current state.
   */
  public loadSchema(schema: FormSchema): void {
    this.formId.set(schema.id);
    this.formTitle.set(schema.title ?? "");
    this.formDescription.set(schema.description ?? "");

    const groups = schema.groups.map((gDef) => {
      const gUid = crypto.randomUUID();
      const fields = gDef.fields.map((fDef) => {
        const fUid = crypto.randomUUID();
        const mf = this.createMutableField(
          fUid,
          fDef.id,
          fDef.title,
          fDef.component,
        );
        mf.description.set(fDef.description ?? "");
        mf.config.set({ ...(fDef.config ?? {}) });
        mf.options.set([...(fDef.options ?? [])]);
        mf.validation.set([...(fDef.validation ?? [])]);
        mf.visibleWhen.set(fDef.visibleWhen ?? null);
        mf.enabledWhen.set(fDef.enabledWhen ?? null);
        mf.defaultValue.set(fDef.defaultValue ?? null);
        return mf;
      });

      const mg = this.createMutableGroup(gUid, gDef.id, gDef.title ?? "");
      mg.description.set(gDef.description ?? "");
      mg.fields.set(fields);
      mg.visibleWhen.set(gDef.visibleWhen ?? null);
      mg.enabledWhen.set(gDef.enabledWhen ?? null);
      return mg;
    });

    this.groups.set(groups);
    this.selection.set(null);
  }

  /**
   * Produce a pretty-printed JSON string of the current schema.
   */
  public toJSON(): string {
    return JSON.stringify(this.schema(), null, 2);
  }

  // ── Private helpers ───────────────────────────────────────────────

  private createMutableField(
    uid: string,
    id: string,
    title: string,
    component: string,
  ): MutableFieldDefinition {
    return {
      uid,
      id: signal(id),
      title: signal(title),
      description: signal(""),
      component: signal(component),
      config: signal({}),
      options: signal([]),
      validation: signal([]),
      visibleWhen: signal(null),
      enabledWhen: signal(null),
      defaultValue: signal(null),
    };
  }

  private createMutableGroup(
    uid: string,
    id: string,
    title: string,
  ): MutableGroupDefinition {
    return {
      uid,
      id: signal(id),
      title: signal(title),
      description: signal(""),
      fields: signal([]),
      visibleWhen: signal(null),
      enabledWhen: signal(null),
    };
  }

  private buildSchema(): FormSchema {
    const groups: FormGroupDefinition[] = this.groups().map((g) => {
      const fields: FormFieldDefinition[] = g.fields().map((f) => {
        const def: Record<string, unknown> = {
          id: f.id(),
          title: f.title(),
          component: f.component(),
        };
        if (f.description()) def["description"] = f.description();
        if (Object.keys(f.config()).length > 0) def["config"] = f.config();
        if (f.options().length > 0) def["options"] = f.options();
        if (f.validation().length > 0) def["validation"] = f.validation();
        if (f.visibleWhen()) def["visibleWhen"] = f.visibleWhen();
        if (f.enabledWhen()) def["enabledWhen"] = f.enabledWhen();
        if (f.defaultValue() !== null) def["defaultValue"] = f.defaultValue();
        return def as unknown as FormFieldDefinition;
      });

      const gDef: Record<string, unknown> = {
        id: g.id(),
        fields,
      };
      if (g.title()) gDef["title"] = g.title();
      if (g.description()) gDef["description"] = g.description();
      if (g.visibleWhen()) gDef["visibleWhen"] = g.visibleWhen();
      if (g.enabledWhen()) gDef["enabledWhen"] = g.enabledWhen();
      return gDef as unknown as FormGroupDefinition;
    });

    const schema: Record<string, unknown> = {
      id: this.formId(),
      groups,
    };
    if (this.formTitle()) schema["title"] = this.formTitle();
    if (this.formDescription()) schema["description"] = this.formDescription();
    return schema as unknown as FormSchema;
  }

  /**
   * Generate a sensible default label from a component key.
   */
  private labelForComponent(component: string): string {
    const labels: Record<string, string> = {
      text: "Text Field",
      select: "Select",
      checkbox: "Checkbox",
      toggle: "Toggle",
      radio: "Radio Group",
      autocomplete: "Autocomplete",
      date: "Date Picker",
      time: "Time Picker",
      datetime: "Date/Time",
      color: "Color Picker",
      slider: "Slider",
      richtext: "Rich Text",
      file: "File Upload",
    };
    return labels[component] ?? component;
  }
}
