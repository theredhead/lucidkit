// ── Export strategy tests ────────────────────────────────────────────

import { describe, it, expect } from "vitest";

import type { FormSchema } from "../types/form-schema.types";
import { toKebabCase, toPascalCase } from "./export-strategy";
import { JsonExportStrategy } from "./json-export-strategy";
import { AngularComponentExportStrategy } from "./angular-component-export-strategy";

const SAMPLE_SCHEMA: FormSchema = {
  id: "contact",
  title: "Contact Form",
  groups: [
    {
      id: "personal",
      title: "Personal Info",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          config: { placeholder: "Enter your first name" },
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          config: { type: "email" },
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Enter a valid e-mail." },
          ],
        },
      ],
    },
  ],
};

// ── String utilities ────────────────────────────────────────────────

describe("toKebabCase", () => {
  it("should convert spaces to hyphens", () => {
    expect(toKebabCase("Contact Form")).toBe("contact-form");
  });

  it("should handle PascalCase input", () => {
    expect(toKebabCase("ContactForm")).toBe("contact-form");
  });

  it("should handle mixed case with numbers", () => {
    expect(toKebabCase("My Form 2")).toBe("my-form-2");
  });

  it("should collapse multiple hyphens", () => {
    expect(toKebabCase("hello   world")).toBe("hello-world");
  });

  it("should strip non-alphanumeric characters", () => {
    expect(toKebabCase("Hello! @World#")).toBe("hello-world");
  });

  it('should fall back to "generated-form" for empty input', () => {
    expect(toKebabCase("")).toBe("generated-form");
    expect(toKebabCase("   ")).toBe("generated-form");
  });
});

describe("toPascalCase", () => {
  it("should convert a title to PascalCase", () => {
    expect(toPascalCase("Contact Form")).toBe("ContactForm");
  });

  it("should handle single word", () => {
    expect(toPascalCase("hello")).toBe("Hello");
  });

  it("should handle mixed input", () => {
    expect(toPascalCase("my cool survey")).toBe("MyCoolSurvey");
  });

  it('should fall back to "GeneratedForm" for empty input', () => {
    expect(toPascalCase("")).toBe("GeneratedForm");
  });
});

// ── JsonExportStrategy ──────────────────────────────────────────────

describe("JsonExportStrategy", () => {
  const strategy = new JsonExportStrategy();

  it('should have label "JSON Schema"', () => {
    expect(strategy.label).toBe("JSON Schema");
  });

  it("should produce a .schema.json file name", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.fileName).toBe("contact-form.schema.json");
  });

  it("should produce application/json MIME type", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.mimeType).toBe("application/json");
  });

  it("should produce valid JSON content", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(() => JSON.parse(result.content)).not.toThrow();
  });

  it("should round-trip the schema through JSON", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(JSON.parse(result.content)).toEqual(SAMPLE_SCHEMA);
  });

  it("should use fallback file name for untitled schema", () => {
    const result = strategy.export({ id: "untitled", groups: [] });
    expect(result.fileName).toBe("form.schema.json");
  });
});

// ── AngularComponentExportStrategy ──────────────────────────────────

describe("AngularComponentExportStrategy", () => {
  const strategy = new AngularComponentExportStrategy();

  it('should have label "Angular Component"', () => {
    expect(strategy.label).toBe("Angular Component");
  });

  it("should produce a .component.ts file name", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.fileName).toBe("contact-form.component.ts");
  });

  it("should produce text/typescript MIME type", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.mimeType).toBe("text/typescript");
  });

  it("should include the correct class name", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("export class ContactFormComponent");
  });

  it("should include the correct selector", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("selector: 'app-contact-form'");
  });

  it("should generate a typed values interface", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("export interface ContactFormFormValues");
    expect(result.content).toContain("readonly firstName: string;");
    expect(result.content).toContain("readonly email: string;");
  });

  it("should generate signal fields for each form field", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain(
      "public readonly firstName = signal<string>('');",
    );
    expect(result.content).toContain(
      "public readonly email = signal<string>('');",
    );
  });

  it("should generate a computed formValues", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain(
      "public readonly formValues = computed<ContactFormFormValues>(",
    );
    expect(result.content).toContain("firstName: this.firstName(),");
    expect(result.content).toContain("email: this.email(),");
  });

  it("should import UI-kit components directly", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("UIInput");
    expect(result.content).toContain("from '@theredhead/ui-kit'");
  });

  it("should NOT import FormEngine or UIForm", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).not.toContain("FormEngine");
    expect(result.content).not.toContain("UIForm");
    expect(result.content).not.toContain("import { UIForm");
  });

  it("should generate a declarative template with ui-input elements", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("<ui-input");
    expect(result.content).toContain('[(value)]="firstName"');
    expect(result.content).toContain('[(value)]="email"');
  });

  it("should include field labels in the template", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("First Name");
    expect(result.content).toContain("E-mail");
  });

  it("should forward config as template attributes", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain('placeholder="Enter your first name"');
    expect(result.content).toContain('type="email"');
  });

  it("should wrap groups in fieldsets with legends", () => {
    const result = strategy.export(SAMPLE_SCHEMA);
    expect(result.content).toContain("<fieldset>");
    expect(result.content).toContain("<legend>Personal Info</legend>");
    expect(result.content).toContain("</fieldset>");
  });

  it("should use fallback names for untitled schema", () => {
    const result = strategy.export({ id: "untitled", groups: [] });
    expect(result.fileName).toBe("generated-form.component.ts");
    expect(result.content).toContain("export class GeneratedFormComponent");
    expect(result.content).toContain("selector: 'app-generated-form'");
  });
});
