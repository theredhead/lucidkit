// ── Angular component export strategy ───────────────────────────────

import type {
  FormFieldDefinition,
  FormGroupDefinition,
  FormSchema,
} from "../types/form-schema.types";
import { toKebabCase, toPascalCase } from "./export-strategy";
import type { ExportResult, ExportStrategy } from "./export-strategy";

// ── Component-key → UI-kit metadata ────────────────────────────────

interface FieldMeta {
  /** Angular component class name. */
  readonly className: string;
  /** Element selector used in templates. */
  readonly selector: string;
  /** The model property for two-way binding (`value`, `checked`, …). */
  readonly modelProp: string;
  /** TypeScript type for the interface property. */
  readonly tsType: string;
  /** Default value literal. */
  readonly defaultValue: string;
}

const FIELD_META: Readonly<Record<string, FieldMeta>> = {
  text: {
    className: "UIInput",
    selector: "ui-input",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  select: {
    className: "UIDropdownList",
    selector: "ui-dropdown-list",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  checkbox: {
    className: "UICheckbox",
    selector: "ui-checkbox",
    modelProp: "checked",
    tsType: "boolean",
    defaultValue: "false",
  },
  toggle: {
    className: "UIToggle",
    selector: "ui-toggle",
    modelProp: "value",
    tsType: "boolean",
    defaultValue: "false",
  },
  radio: {
    className: "UIRadioGroup",
    selector: "ui-radio-group",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  autocomplete: {
    className: "UIAutocomplete",
    selector: "ui-autocomplete",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  date: {
    className: "UIInput",
    selector: "ui-input",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  time: {
    className: "UIInput",
    selector: "ui-input",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  datetime: {
    className: "UIInput",
    selector: "ui-input",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  color: {
    className: "UIColorPicker",
    selector: "ui-color-picker",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  slider: {
    className: "UISlider",
    selector: "ui-slider",
    modelProp: "value",
    tsType: "number",
    defaultValue: "0",
  },
  richtext: {
    className: "UIRichTextEditor",
    selector: "ui-rich-text-editor",
    modelProp: "value",
    tsType: "string",
    defaultValue: "''",
  },
  file: {
    className: "UIFileUpload",
    selector: "ui-file-upload",
    modelProp: "files",
    tsType: "File[]",
    defaultValue: "[]",
  },
};

/** Fallback for unknown component keys. */
const UNKNOWN_META: FieldMeta = {
  className: "UIInput",
  selector: "ui-input",
  modelProp: "value",
  tsType: "string",
  defaultValue: "''",
};

// ── Helpers ─────────────────────────────────────────────────────────

/** @internal Convert a field id to a safe camelCase identifier. */
function toCamelCase(text: string): string {
  const pascal = toPascalCase(text);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/** @internal Resolve FieldMeta for a component key. */
function metaFor(componentKey: string): FieldMeta {
  return FIELD_META[componentKey] ?? UNKNOWN_META;
}

/**
 * @internal Render config entries as template attribute bindings.
 *
 * String values → `key="value"`, others → `[key]="value"`.
 */
function configAttrs(
  config: Readonly<Record<string, unknown>> | undefined,
): string {
  if (!config) return "";
  return Object.entries(config)
    .map(([k, v]) =>
      typeof v === "string" ? `${k}="${v}"` : `[${k}]="${String(v)}"`,
    )
    .join(" ");
}

/**
 * @internal Build the options property name for a field
 * (e.g. `emailOptions`).
 */
function optionsPropName(fieldId: string): string {
  return toCamelCase(fieldId) + "Options";
}

// ── Strategy ────────────────────────────────────────────────────────

/**
 * Exports a {@link FormSchema} as a standalone Angular component
 * with a fully declarative HTML template.
 *
 * The generated `.component.ts` file contains:
 *
 * - A typed `<Title>FormValues` interface with one property per field
 * - Individual `signal()` fields for two-way binding
 * - A `computed()` `formValues` signal that assembles the full typed object
 * - A template that directly uses `@theredhead/lucid-kit` components
 *   (`<ui-input>`, `<ui-select>`, …) — no `FormEngine` or `<ui-form>`
 *
 * The component is almost entirely declarative: the TypeScript class
 * is just signals and a single computed.
 */
export class AngularComponentExportStrategy implements ExportStrategy {
  public readonly label = "Angular Component";
  public readonly description =
    "Standalone Angular component with declarative template.";

  public export(schema: FormSchema): ExportResult {
    const title = schema.title?.trim() || "Generated Form";
    const kebab = toKebabCase(title);
    const pascal = toPascalCase(title);
    const className = pascal + "Component";
    const interfaceName = pascal + "FormValues";
    const selector = "app-" + kebab;
    const fileName = kebab + ".component.ts";

    const allFields = schema.groups.flatMap((g) => g.fields);

    const lines: string[] = [
      "// ── Generated by @theredhead/lucid-forms Designer ──────────────────────",
      "",
      ...this.buildImports(allFields),
      "",
      ...this.buildInterface(interfaceName, allFields),
      "",
      ...this.buildComponent(
        selector,
        className,
        interfaceName,
        allFields,
        schema.groups,
      ),
      "",
    ];

    return {
      mimeType: "text/typescript",
      fileName,
      content: lines.join("\n"),
    };
  }

  // ── Code generators ─────────────────────────────────────────────

  /** @internal Build the import statements. */
  private buildImports(fields: readonly FormFieldDefinition[]): string[] {
    const angularImports = [
      "ChangeDetectionStrategy",
      "Component",
      "computed",
      "signal",
    ];
    const hasOutput = true; // always include formValues output
    if (hasOutput) angularImports.push("output");

    const uiKitComponents = new Set<string>();
    for (const f of fields) {
      uiKitComponents.add(metaFor(f.component).className);
    }
    const sorted = [...uiKitComponents].sort();

    return [
      `import { ${angularImports.join(", ")} } from '@angular/core';`,
      `import { ${sorted.join(", ")} } from '@theredhead/lucid-kit';`,
    ];
  }

  /** @internal Build the values interface. */
  private buildInterface(
    name: string,
    fields: readonly FormFieldDefinition[],
  ): string[] {
    const lines: string[] = [`export interface ${name} {`];
    for (const f of fields) {
      const meta = metaFor(f.component);
      const prop = toCamelCase(f.id);
      if (f.title) {
        lines.push(`  /** ${f.title} */`);
      }
      lines.push(`  readonly ${prop}: ${meta.tsType};`);
    }
    lines.push("}");
    return lines;
  }

  /** @internal Build the full @Component class. */
  private buildComponent(
    selector: string,
    className: string,
    interfaceName: string,
    fields: readonly FormFieldDefinition[],
    groups: readonly FormGroupDefinition[],
  ): string[] {
    const uiKitComponents = new Set<string>();
    for (const f of fields) {
      uiKitComponents.add(metaFor(f.component).className);
    }
    const sorted = [...uiKitComponents].sort();

    const template = this.buildTemplate(groups);
    const classBody = this.buildClassBody(interfaceName, fields);

    return [
      "@Component({",
      `  selector: '${selector}',`,
      "  standalone: true,",
      `  imports: [${sorted.join(", ")}],`,
      "  changeDetection: ChangeDetectionStrategy.OnPush,",
      "  template: `",
      ...template.map((l) => "    " + l),
      "  `,",
      "})",
      `export class ${className} {`,
      ...classBody.map((l) => (l ? "  " + l : "")),
      "}",
    ];
  }

  /** @internal Build the HTML template with fieldsets and components. */
  private buildTemplate(groups: readonly FormGroupDefinition[]): string[] {
    const lines: string[] = [];

    for (const group of groups) {
      if (group.title) {
        lines.push("<fieldset>");
        lines.push(`  <legend>${group.title}</legend>`);
        lines.push("");
      }

      for (const field of group.fields) {
        const meta = metaFor(field.component);
        const prop = toCamelCase(field.id);
        const attrs: string[] = [];

        // Two-way binding
        attrs.push(`[(${meta.modelProp})]="${prop}"`);

        // aria-label
        if (field.title) {
          attrs.push(`ariaLabel="${field.title}"`);
        }

        // Options (select, radio, autocomplete)
        if (field.options && field.options.length > 0) {
          attrs.push(`[options]="${optionsPropName(field.id)}"`);
        }

        // Config attributes
        const cfgStr = configAttrs(field.config);
        if (cfgStr) {
          attrs.push(cfgStr);
        }

        const label = field.title || field.id;
        const indent = group.title ? "  " : "";

        lines.push(`${indent}<label>`);
        lines.push(`${indent}  ${label}`);
        lines.push(`${indent}  <${meta.selector} ${attrs.join(" ")} />`);
        lines.push(`${indent}</label>`);
        lines.push("");
      }

      if (group.title) {
        lines.push("</fieldset>");
        lines.push("");
      }
    }

    return lines;
  }

  /** @internal Build the class body: signals, options, computed. */
  private buildClassBody(
    interfaceName: string,
    fields: readonly FormFieldDefinition[],
  ): string[] {
    const lines: string[] = [];

    // Signal fields
    lines.push("// ── Field signals ──");
    for (const f of fields) {
      const meta = metaFor(f.component);
      const prop = toCamelCase(f.id);
      const defaultVal =
        f.defaultValue !== undefined
          ? JSON.stringify(f.defaultValue)
          : meta.defaultValue;
      lines.push(
        `public readonly ${prop} = signal<${meta.tsType}>(${defaultVal});`,
      );
    }

    // Options properties
    const fieldsWithOptions = fields.filter(
      (f) => f.options && f.options.length > 0,
    );
    if (fieldsWithOptions.length > 0) {
      lines.push("");
      lines.push("// ── Options ──");
      for (const f of fieldsWithOptions) {
        const name = optionsPropName(f.id);
        const json = JSON.stringify(
          f.options!.map((o) => ({ label: o.label, value: o.value })),
          null,
          2,
        );
        // Indent the JSON nicely
        const indented = json.replace(/\n/g, "\n  ");
        lines.push(`protected readonly ${name} = ${indented} as const;`);
      }
    }

    // Computed form values
    lines.push("");
    lines.push("// ── Assembled form values ──");
    lines.push(
      `public readonly formValues = computed<${interfaceName}>(() => ({`,
    );
    for (const f of fields) {
      const prop = toCamelCase(f.id);
      lines.push(`  ${prop}: this.${prop}(),`);
    }
    lines.push("}));");

    return lines;
  }
}
