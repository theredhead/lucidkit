// ── UIPropertyInspector ─────────────────────────────────────────────

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from "@angular/core";

import {
  ModalService,
  type SelectOption,
  UICheckbox,
  UIDropdownList,
  UIIcon,
  UIIcons,
  UIInput,
} from "@theredhead/lucid-kit";

import { isFlairComponent } from "../../types/form-schema.types";
import type {
  FormDesignerEngine,
  MutableFieldDefinition,
} from "./designer-engine";

import { type ConfigPropertySchema, getConfigSchema } from "./config-schema";
import { UIRichTextContentDialog } from "./richtext-content-dialog/richtext-content-dialog.component";

import type {
  ValidationRule,
  ValidationRuleType,
} from "../../types/validation.types";
import { UISurface } from "@theredhead/lucid-foundation";

/** Available component keys for the component selector. */
const COMPONENT_OPTIONS: SelectOption[] = [
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
  "signature",
  "flair:richtext",
  "flair:image",
  "flair:media",
].map((k) => ({ value: k, label: k }));

/** Available validation rule types. */
const VALIDATION_TYPE_OPTIONS: SelectOption[] = (
  [
    "required",
    "minLength",
    "maxLength",
    "min",
    "max",
    "pattern",
    "email",
  ] satisfies ValidationRuleType[]
).map((k) => ({ value: k, label: k }));

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
  imports: [UIIcon, UIInput, UIDropdownList, UICheckbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: UISurface, inputs: ["surfaceType"] }],
  host: { class: "ui-property-inspector" },
  templateUrl: "./property-inspector.component.html",
  styleUrl: "./property-inspector.component.scss",
})
export class UIPropertyInspector {
  /** The designer engine driving this inspector. */
  public readonly engine = input.required<FormDesignerEngine>();

  /** @internal */
  protected readonly componentOptions = COMPONENT_OPTIONS;

  /** @internal */
  protected readonly validationTypeOptions = VALIDATION_TYPE_OPTIONS;

  /** @internal */
  protected readonly configError = signal<string>("");

  /** @internal X icon for remove buttons. */
  protected readonly iconX = UIIcons.Lucide.Notifications.X;

  /** @internal Edit icon for the rich text button. */
  protected readonly iconEdit = UIIcons.Lucide.Text.Type;

  private readonly modalService = inject(ModalService);

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

  /** @internal Set a boolean config value. */
  protected setConfigBoolean(
    field: MutableFieldDefinition,
    key: string,
    checked: boolean,
  ): void {
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

  /** @internal Normalize select options to SelectOption[] with empty option. */
  protected configSelectOptions(prop: ConfigPropertySchema): SelectOption[] {
    const opts = (prop.options ?? []).map((o) =>
      typeof o === "string" ? { label: o, value: o } : o,
    );
    return [{ label: "\u2014", value: "" }, ...opts];
  }

  /** @internal Open a richtext editor dialog for the given config key. */
  protected openRichTextEditor(
    field: MutableFieldDefinition,
    key: string,
  ): void {
    const current = (field.config()[key] as string) ?? "";
    this.modalService
      .openModal<UIRichTextContentDialog, string>({
        component: UIRichTextContentDialog,
        inputs: { initialContent: current },
        ariaLabel: "Edit rich text content",
      })
      .closed.subscribe((result) => {
        if (result !== undefined) {
          this.setConfigValue(field, key, result);
        }
      });
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
