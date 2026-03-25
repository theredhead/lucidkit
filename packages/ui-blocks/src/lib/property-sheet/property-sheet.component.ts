import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
} from "@angular/core";

import {
  UICheckbox,
  UIColorPicker,
  UIInput,
  UISelect,
  UISlider,
} from "@theredhead/ui-kit";

import type {
  PropertyChangeEvent,
  PropertyFieldDefinition,
} from "./property-sheet.types";

/**
 * Grouped field set used internally to organise fields by group.
 * @internal
 */
interface FieldGroup<T> {
  readonly name: string;
  readonly fields: readonly PropertyFieldDefinition<T>[];
}

/**
 * A key-value inspector panel that renders a schema of typed fields
 * against a data object.
 *
 * Each field definition maps to an appropriate editor widget
 * (`UIInput`, `UISelect`, `UICheckbox`, `UIColorPicker`, or
 * `UISlider`). Changes are emitted per-field via
 * {@link propertyChange} and the data model is updated in-place.
 *
 * ### Basic usage
 * ```html
 * <ui-property-sheet
 *   [fields]="fields"
 *   [(data)]="config"
 *   (propertyChange)="onChanged($event)"
 * />
 * ```
 *
 * ### Grouped fields
 * ```ts
 * const fields: PropertyFieldDefinition<Config>[] = [
 *   { key: 'name',  label: 'Name',  type: 'string', group: 'General' },
 *   { key: 'color', label: 'Color', type: 'color',  group: 'Appearance' },
 * ];
 * ```
 */
@Component({
  selector: "ui-property-sheet",
  standalone: true,
  imports: [UIInput, UISelect, UICheckbox, UIColorPicker, UISlider],
  templateUrl: "./property-sheet.component.html",
  styleUrl: "./property-sheet.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "ui-property-sheet",
  },
})
export class UIPropertySheet<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  // ── Inputs ────────────────────────────────────────────────────────

  /** Field definitions describing the properties to edit. */
  public readonly fields =
    input.required<readonly PropertyFieldDefinition<T>[]>();

  /** Accessible label for the sheet. */
  public readonly ariaLabel = input<string>("Property sheet");

  // ── Models ────────────────────────────────────────────────────────

  /** The data object being inspected/edited (two-way bindable). */
  public readonly data = model<T>({} as T);

  // ── Outputs ───────────────────────────────────────────────────────

  /** Emits when any property value changes. */
  public readonly propertyChange = output<PropertyChangeEvent<T>>();

  // ── Computed ──────────────────────────────────────────────────────

  /** @internal — fields organised into named groups. */
  protected readonly groups = computed<readonly FieldGroup<T>[]>(() => {
    const defs = this.fields();
    const map = new Map<string, PropertyFieldDefinition<T>[]>();

    for (const field of defs) {
      const group = field.group ?? "";
      let list = map.get(group);
      if (!list) {
        list = [];
        map.set(group, list);
      }
      list.push(field);
    }

    const result: FieldGroup<T>[] = [];
    for (const [name, fields] of map) {
      result.push({ name, fields });
    }
    return result;
  });

  // ── Protected methods ─────────────────────────────────────────────

  /** @internal — read a field value from the data object. */
  protected getValue(key: string): unknown {
    return this.data()[key as keyof T];
  }

  /** @internal — update a field and emit. */
  protected onValueChange(key: string & keyof T, value: unknown): void {
    const updated = { ...this.data(), [key]: value };
    this.data.set(updated);
    this.propertyChange.emit({ key, value, data: updated });
  }
}
