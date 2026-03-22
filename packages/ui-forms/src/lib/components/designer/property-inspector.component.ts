// ── UIPropertyInspector ─────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

import { UIIcon, UIIcons } from "@theredhead/ui-kit";

import { isFlairComponent } from "../../types/form-schema.types";
import type {
  FormDesignerEngine,
  MutableFieldDefinition,
} from "./designer-engine";

import { type ConfigPropertySchema, getConfigSchema } from "./config-schema";

import type {
  ValidationRule,
  ValidationRuleType,
} from "../../types/validation.types";

/** Available component keys for the component selector. */
const COMPONENT_OPTIONS = [
  "text",
  "select",
  "checkbox",
  "toggle",
  "radio",
  "autocomplete",
  "date",
  "time",
  "datetime",
  "color",
  "slider",
  "richtext",
  "file",
  "flair:richtext",
  "flair:image",
  "flair:media",
] as const;

/** Available validation rule types. */
const VALIDATION_TYPES: ValidationRuleType[] = [
  "required",
  "minLength",
  "maxLength",
  "min",
  "max",
  "pattern",
  "email",
];

/**
 * Property inspector panel for editing the properties of the
 * currently selected field, group, or form.
 *
 * @example
 * ```html
 * <ui-property-inspector [engine]="engine" />
 * ```
 */
@Component({
  selector: "ui-property-inspector",
  standalone: true,
  imports: [UIIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "ui-property-inspector" },
  template: `
    @if (engine().selection(); as sel) {
      @switch (sel.kind) {
        @case ("form") {
          <h3 class="pi-heading">Form Properties</h3>
          <div class="pi-section">
            <label class="pi-label">
              ID
              <input
                class="pi-input"
                [value]="engine().formId()"
                (input)="engine().formId.set(inputValue($event))"
              />
            </label>

            <label class="pi-label">
              Title
              <input
                class="pi-input"
                [value]="engine().formTitle()"
                (input)="engine().formTitle.set(inputValue($event))"
              />
            </label>

            <label class="pi-label">
              Description
              <textarea
                class="pi-textarea"
                rows="2"
                [value]="engine().formDescription()"
                (input)="engine().formDescription.set(inputValue($event))"
              ></textarea>
            </label>
          </div>
        }

        @case ("group") {
          @if (engine().selectedGroup(); as group) {
            <h3 class="pi-heading">Group Properties</h3>
            <div class="pi-section">
              <label class="pi-label">
                ID
                <input
                  class="pi-input"
                  [value]="group.id()"
                  (input)="group.id.set(inputValue($event))"
                />
              </label>

              <label class="pi-label">
                Title
                <input
                  class="pi-input"
                  [value]="group.title()"
                  (input)="group.title.set(inputValue($event))"
                />
              </label>

              <label class="pi-label">
                Description
                <textarea
                  class="pi-textarea"
                  rows="2"
                  [value]="group.description()"
                  (input)="group.description.set(inputValue($event))"
                ></textarea>
              </label>
            </div>
          }
        }

        @case ("field") {
          @if (engine().selectedField(); as field) {
            <h3 class="pi-heading">Field Properties</h3>
            <div class="pi-section">
              <label class="pi-label">
                ID
                <input
                  class="pi-input"
                  [value]="field.id()"
                  (input)="field.id.set(inputValue($event))"
                />
              </label>

              <label class="pi-label">
                Title
                <input
                  class="pi-input"
                  [value]="field.title()"
                  (input)="field.title.set(inputValue($event))"
                />
              </label>

              <label class="pi-label">
                Description
                <textarea
                  class="pi-textarea"
                  rows="2"
                  [value]="field.description()"
                  (input)="field.description.set(inputValue($event))"
                ></textarea>
              </label>

              <label class="pi-label">
                Component
                <select
                  class="pi-select"
                  [value]="field.component()"
                  (change)="field.component.set(inputValue($event))"
                >
                  @for (opt of componentOptions; track opt) {
                    <option [value]="opt">{{ opt }}</option>
                  }
                </select>
              </label>

              @if (!isFieldFlair(field)) {
                <label class="pi-label">
                  Default Value
                  <input
                    class="pi-input"
                    [value]="field.defaultValue() ?? ''"
                    (input)="field.defaultValue.set(inputValue($event) || null)"
                  />
                </label>
              }
            </div>

            <!-- Options (for select/radio/autocomplete) -->
            @if (!isFieldFlair(field) && showOptions(field)) {
              <h4 class="pi-subheading">Options</h4>
              <div class="pi-section">
                @for (opt of field.options(); track $index; let i = $index) {
                  <div class="pi-option-row">
                    <input
                      class="pi-input pi-input--sm"
                      placeholder="Label"
                      [value]="opt.label"
                      (input)="
                        updateOption(field, i, 'label', inputValue($event))
                      "
                    />
                    <input
                      class="pi-input pi-input--sm"
                      placeholder="Value"
                      [value]="opt.value"
                      (input)="
                        updateOption(field, i, 'value', inputValue($event))
                      "
                    />
                    <button
                      type="button"
                      class="pi-icon-btn pi-icon-btn--danger"
                      aria-label="Remove option"
                      (click)="removeOption(field, i)"
                    >
                      <ui-icon [svg]="iconX" [size]="12" aria-hidden="true" />
                    </button>
                  </div>
                }
                <button
                  type="button"
                  class="pi-add-btn"
                  (click)="addOption(field)"
                >
                  + Add option
                </button>
              </div>
            }

            <!-- Validation -->
            @if (!isFieldFlair(field)) {
              <h4 class="pi-subheading">Validation</h4>
              <div class="pi-section">
                @for (
                  rule of field.validation();
                  track $index;
                  let i = $index
                ) {
                  <div class="pi-validation-row">
                    <select
                      class="pi-select pi-select--sm"
                      [value]="rule.type"
                      (change)="
                        updateValidationRule(
                          field,
                          i,
                          'type',
                          inputValue($event)
                        )
                      "
                    >
                      @for (vt of validationTypes; track vt) {
                        <option [value]="vt">{{ vt }}</option>
                      }
                    </select>

                    @if (ruleHasParam(rule.type)) {
                      <input
                        class="pi-input pi-input--sm"
                        [placeholder]="paramPlaceholder(rule.type)"
                        [value]="ruleParamValue(rule)"
                        (input)="
                          updateValidationParam(
                            field,
                            i,
                            rule.type,
                            inputValue($event)
                          )
                        "
                      />
                    }

                    <input
                      class="pi-input pi-input--sm"
                      placeholder="Error message"
                      [value]="rule.message ?? ''"
                      (input)="
                        updateValidationRule(
                          field,
                          i,
                          'message',
                          inputValue($event)
                        )
                      "
                    />

                    <button
                      type="button"
                      class="pi-icon-btn pi-icon-btn--danger"
                      aria-label="Remove validation rule"
                      (click)="removeValidationRule(field, i)"
                    >
                      <ui-icon [svg]="iconX" [size]="12" aria-hidden="true" />
                    </button>
                  </div>
                }
                <button
                  type="button"
                  class="pi-add-btn"
                  (click)="addValidationRule(field)"
                >
                  + Add rule
                </button>
              </div>
            }

            <!-- Config -->
            @if (configSchemaFor(field).length > 0) {
              <h4 class="pi-subheading">Config</h4>
              <div class="pi-section">
                @for (prop of configSchemaFor(field); track prop.key) {
                  @if (!prop.visibleWhen || prop.visibleWhen(field.config())) {
                    @switch (prop.editor) {
                      @case ("text") {
                        <label class="pi-label">
                          {{ prop.label }}
                          <input
                            class="pi-input"
                            [placeholder]="prop.placeholder ?? ''"
                            [value]="configValue(field, prop.key) ?? ''"
                            (input)="
                              setConfigValue(
                                field,
                                prop.key,
                                inputValue($event)
                              )
                            "
                          />
                        </label>
                      }

                      @case ("number") {
                        <label class="pi-label">
                          {{ prop.label }}
                          <input
                            class="pi-input"
                            type="number"
                            [placeholder]="prop.placeholder ?? ''"
                            [value]="configValue(field, prop.key) ?? ''"
                            (input)="
                              setConfigNumber(
                                field,
                                prop.key,
                                inputValue($event)
                              )
                            "
                          />
                        </label>
                      }

                      @case ("boolean") {
                        <label class="pi-label pi-label--row">
                          <input
                            type="checkbox"
                            [checked]="!!configValue(field, prop.key)"
                            (change)="setConfigBoolean(field, prop.key, $event)"
                          />
                          {{ prop.label }}
                        </label>
                      }

                      @case ("select") {
                        <label class="pi-label">
                          {{ prop.label }}
                          <select
                            class="pi-select"
                            [value]="configValue(field, prop.key) ?? ''"
                            (change)="
                              setConfigValue(
                                field,
                                prop.key,
                                inputValue($event)
                              )
                            "
                          >
                            <option value="">—</option>
                            @for (
                              opt of configSelectOptions(prop);
                              track opt.value
                            ) {
                              <option [value]="opt.value">
                                {{ opt.label }}
                              </option>
                            }
                          </select>
                        </label>
                      }
                    }
                  }
                }
              </div>
            }

            <!-- Extra config (raw JSON, for properties not in the schema) -->
            @if (hasExtraConfig(field)) {
              <h4 class="pi-subheading">Extra Config (JSON)</h4>
              <div class="pi-section">
                <textarea
                  class="pi-textarea pi-textarea--mono"
                  rows="3"
                  aria-label="Extra configuration JSON"
                  aria-describedby="pi-config-error"
                  [attr.aria-invalid]="configError() ? 'true' : null"
                  [value]="extraConfigJSON(field)"
                  (change)="onExtraConfigChange(field, $event)"
                ></textarea>
                @if (configError()) {
                  <p class="pi-error" id="pi-config-error" role="alert">
                    {{ configError() }}
                  </p>
                }
              </div>
            }
          }
        }
      }
    } @else {
      <div class="pi-empty">
        <p>Select a field, group, or form header to edit its properties.</p>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--ui-border, #d7dce2);
      background: var(--ui-surface, #f7f8fa);
      padding: 12px;
      overflow-y: auto;
      min-width: 260px;
      max-width: 320px;
    }

    .pi-heading {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 12px;
      color: var(--ui-text, #1d232b);
      opacity: 0.6;
    }

    .pi-subheading {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 16px 0 8px;
      color: var(--ui-text, #1d232b);
      opacity: 0.5;
    }

    .pi-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .pi-label {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ui-text, #1d232b);
    }

    .pi-label--row {
      flex-direction: row;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }

    .pi-input,
    .pi-textarea,
    .pi-select {
      appearance: none;
      border: 1px solid var(--ui-border, #d7dce2);
      border-radius: 5px;
      padding: 6px 8px;
      font-size: 0.8125rem;
      background: var(--ui-surface-alt, #ffffff);
      color: var(--ui-text, #1d232b);
      font-family: inherit;
    }

    .pi-input:focus,
    .pi-textarea:focus,
    .pi-select:focus {
      outline: 2px solid var(--theredhead-primary, #3584e4);
      outline-offset: -1px;
    }

    .pi-input--sm {
      padding: 4px 6px;
      font-size: 0.75rem;
    }

    .pi-select--sm {
      padding: 4px 6px;
      font-size: 0.75rem;
    }

    .pi-textarea--mono {
      font-family: monospace;
      font-size: 0.75rem;
    }

    .pi-option-row,
    .pi-validation-row {
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .pi-option-row .pi-input {
      flex: 1;
    }

    .pi-validation-row > * {
      flex: 1;
      min-width: 0;
    }

    .pi-validation-row .pi-icon-btn {
      flex: 0 0 auto;
    }

    .pi-icon-btn {
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 0.75rem;
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--ui-text, #1d232b);
    }

    .pi-icon-btn:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .pi-icon-btn--danger:hover {
      background: var(--theredhead-error, #ba1a1a);
      color: #ffffff;
    }

    .pi-add-btn {
      appearance: none;
      border: 1px dashed var(--ui-border, #d7dce2);
      background: transparent;
      border-radius: 5px;
      padding: 5px 8px;
      cursor: pointer;
      font-size: 0.75rem;
      color: var(--theredhead-primary, #3584e4);
      font-weight: 500;
    }

    .pi-add-btn:hover {
      background: var(--theredhead-primary-container, #d6e3ff);
    }

    .pi-error {
      font-size: 0.75rem;
      color: var(--theredhead-error, #ba1a1a);
      margin: 2px 0 0;
    }

    .pi-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.8125rem;
      color: var(--ui-text-muted, #5a6270);
      padding: 24px;
    }

    /* Dark mode */

    :host-context(html.dark-theme) {
      background: var(--ui-surface, #1e2128);
      border-left-color: var(--ui-border, #3a3f47);

      .pi-heading,
      .pi-subheading,
      .pi-label {
        color: var(--ui-text, #f2f6fb);
      }

      .pi-input,
      .pi-textarea,
      .pi-select {
        background: var(--ui-surface-alt, #2a2e36);
        border-color: var(--ui-border, #3a3f47);
        color: var(--ui-text, #f2f6fb);
      }

      .pi-icon-btn {
        color: var(--ui-text, #f2f6fb);
      }
      .pi-icon-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .pi-add-btn {
        border-color: var(--ui-border, #3a3f47);
        color: var(--theredhead-primary, #a8c8ff);
      }
      .pi-add-btn:hover {
        background: var(--theredhead-primary-container, #004787);
      }

      .pi-error {
        color: var(--theredhead-error, #ffb4ab);
      }
      .pi-empty {
        color: var(--ui-text-muted, #a0a8b4);
      }
    }

    @media (prefers-color-scheme: dark) {
      :host-context(html:not(.light-theme):not(.dark-theme)) {
        background: var(--ui-surface, #1e2128);
        border-left-color: var(--ui-border, #3a3f47);

        .pi-heading,
        .pi-subheading,
        .pi-label {
          color: var(--ui-text, #f2f6fb);
        }

        .pi-input,
        .pi-textarea,
        .pi-select {
          background: var(--ui-surface-alt, #2a2e36);
          border-color: var(--ui-border, #3a3f47);
          color: var(--ui-text, #f2f6fb);
        }

        .pi-icon-btn {
          color: var(--ui-text, #f2f6fb);
        }
        .pi-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .pi-add-btn {
          border-color: var(--ui-border, #3a3f47);
          color: var(--theredhead-primary, #a8c8ff);
        }
        .pi-add-btn:hover {
          background: var(--theredhead-primary-container, #004787);
        }

        .pi-error {
          color: var(--theredhead-error, #ffb4ab);
        }
        .pi-empty {
          color: var(--ui-text-muted, #a0a8b4);
        }
      }
    }
  `,
})
export class UIPropertyInspector {
  /** The designer engine driving this inspector. */
  public readonly engine = input.required<FormDesignerEngine>();

  /** @internal */
  protected readonly componentOptions = COMPONENT_OPTIONS;

  /** @internal */
  protected readonly validationTypes = VALIDATION_TYPES;

  /** @internal */
  protected readonly configError = signal<string>("");

  /** @internal X icon for remove buttons. */
  protected readonly iconX = UIIcons.Lucide.Notifications.X;

  // ── Helpers ───────────────────────────────────────────────────────

  /** @internal Extract input value from a DOM event. */
  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  /** @internal Whether the field type supports options. */
  protected showOptions(field: MutableFieldDefinition): boolean {
    const comp = field.component();
    return comp === "select" || comp === "radio" || comp === "autocomplete";
  }

  /** @internal Whether the field is a flair (non-data) component. */
  protected isFieldFlair(field: MutableFieldDefinition): boolean {
    return isFlairComponent(field.component());
  }

  // ── Options ───────────────────────────────────────────────────────

  /** @internal */
  protected addOption(field: MutableFieldDefinition): void {
    field.options.update((opts) => [...opts, { label: "", value: "" }]);
  }

  /** @internal */
  protected removeOption(field: MutableFieldDefinition, index: number): void {
    field.options.update((opts) => opts.filter((_, i) => i !== index));
  }

  /** @internal */
  protected updateOption(
    field: MutableFieldDefinition,
    index: number,
    key: "label" | "value",
    value: string,
  ): void {
    field.options.update((opts) => {
      const copy = [...opts];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  }

  // ── Validation ────────────────────────────────────────────────────

  /** @internal */
  protected addValidationRule(field: MutableFieldDefinition): void {
    field.validation.update((rules) => [
      ...rules,
      { type: "required" as ValidationRuleType, message: "" },
    ]);
  }

  /** @internal */
  protected removeValidationRule(
    field: MutableFieldDefinition,
    index: number,
  ): void {
    field.validation.update((rules) => rules.filter((_, i) => i !== index));
  }

  /** @internal */
  protected updateValidationRule(
    field: MutableFieldDefinition,
    index: number,
    key: string,
    value: string,
  ): void {
    field.validation.update((rules) => {
      const copy = [...rules];
      copy[index] = { ...copy[index], [key]: value } as ValidationRule;
      return copy;
    });
  }

  /** @internal */
  protected ruleHasParam(type: string): boolean {
    return ["minLength", "maxLength", "min", "max", "pattern"].includes(type);
  }

  /** @internal */
  protected paramPlaceholder(type: string): string {
    switch (type) {
      case "minLength":
        return "Min length";
      case "maxLength":
        return "Max length";
      case "min":
        return "Min value";
      case "max":
        return "Max value";
      case "pattern":
        return "Regex pattern";
      default:
        return "Param";
    }
  }

  /** @internal */
  protected ruleParamValue(rule: ValidationRule): string {
    if (!rule.params) return "";
    const p = rule.params;
    return String(p["min"] ?? p["max"] ?? p["pattern"] ?? "");
  }

  /** @internal */
  protected updateValidationParam(
    field: MutableFieldDefinition,
    index: number,
    type: string,
    value: string,
  ): void {
    field.validation.update((rules) => {
      const copy = [...rules];
      let params: Record<string, unknown>;
      switch (type) {
        case "minLength":
          params = { min: parseInt(value, 10) || 0 };
          break;
        case "maxLength":
          params = { max: parseInt(value, 10) || 0 };
          break;
        case "min":
          params = { min: parseFloat(value) || 0 };
          break;
        case "max":
          params = { max: parseFloat(value) || 0 };
          break;
        case "pattern":
          params = { pattern: value };
          break;
        default:
          params = {};
      }
      copy[index] = { ...copy[index], params };
      return copy;
    });
  }

  // ── Structured Config ─────────────────────────────────────────────

  /** @internal Returns the config property schemas for the field's component. */
  protected configSchemaFor(
    field: MutableFieldDefinition,
  ): readonly ConfigPropertySchema[] {
    return getConfigSchema(field.component());
  }

  /** @internal Read a single config value. */
  protected configValue(field: MutableFieldDefinition, key: string): unknown {
    return field.config()[key] ?? null;
  }

  /** @internal Set a string config value (removes key if empty). */
  protected setConfigValue(
    field: MutableFieldDefinition,
    key: string,
    value: string,
  ): void {
    field.config.update((cfg) => {
      const copy = { ...cfg };
      if (value === "") {
        delete copy[key];
      } else {
        copy[key] = value;
      }
      return copy;
    });
  }

  /** @internal Set a numeric config value (removes key if empty/NaN). */
  protected setConfigNumber(
    field: MutableFieldDefinition,
    key: string,
    raw: string,
  ): void {
    field.config.update((cfg) => {
      const copy = { ...cfg };
      const n = parseFloat(raw);
      if (raw === "" || isNaN(n)) {
        delete copy[key];
      } else {
        copy[key] = n;
      }
      return copy;
    });
  }

  /** @internal Set a boolean config value from a checkbox event. */
  protected setConfigBoolean(
    field: MutableFieldDefinition,
    key: string,
    event: Event,
  ): void {
    const checked = (event.target as HTMLInputElement).checked;
    field.config.update((cfg) => {
      const copy = { ...cfg };
      if (!checked) {
        delete copy[key];
      } else {
        copy[key] = true;
      }
      return copy;
    });
  }

  /** @internal Normalize select options to { label, value } pairs. */
  protected configSelectOptions(
    prop: ConfigPropertySchema,
  ): readonly { label: string; value: string }[] {
    return (prop.options ?? []).map((o) =>
      typeof o === "string" ? { label: o, value: o } : o,
    );
  }

  // ── Extra Config (raw JSON for unknown keys) ──────────────────────

  /** @internal Whether the field has config keys not covered by the schema. */
  protected hasExtraConfig(field: MutableFieldDefinition): boolean {
    const schemaKeys = new Set(
      getConfigSchema(field.component()).map((p) => p.key),
    );
    return Object.keys(field.config()).some((k) => !schemaKeys.has(k));
  }

  /** @internal JSON string of config keys NOT in the structured schema. */
  protected extraConfigJSON(field: MutableFieldDefinition): string {
    const schemaKeys = new Set(
      getConfigSchema(field.component()).map((p) => p.key),
    );
    const extra: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(field.config())) {
      if (!schemaKeys.has(k)) extra[k] = v;
    }
    return Object.keys(extra).length > 0 ? JSON.stringify(extra, null, 2) : "";
  }

  /** @internal Parse and merge extra config JSON back into the field. */
  protected onExtraConfigChange(
    field: MutableFieldDefinition,
    event: Event,
  ): void {
    const raw = (event.target as HTMLTextAreaElement).value.trim();
    const schemaKeys = new Set(
      getConfigSchema(field.component()).map((p) => p.key),
    );

    // Keep all schema-managed keys, replace extra keys
    const managed: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(field.config())) {
      if (schemaKeys.has(k)) managed[k] = v;
    }

    if (!raw) {
      field.config.set(managed);
      this.configError.set("");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        field.config.set({ ...managed, ...parsed });
        this.configError.set("");
      } else {
        this.configError.set("Config must be a JSON object.");
      }
    } catch {
      this.configError.set("Invalid JSON.");
    }
  }
}
