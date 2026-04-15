// ── Form Designer stories ───────────────────────────────────────────

import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from "@angular/core";

import { JsonPipe } from "@angular/common";

import { provideBuiltInFormFields } from "../../registry/built-in-fields";
import type { FormSchema } from "../../types/form-schema.types";
import type { ExportResult, ExportStrategy } from "../../export";
import {
  JsonExportStrategy,
  AngularComponentExportStrategy,
} from "../../export";
import { UIFormDesigner } from "./form-designer.component";
import { UIButton } from "@theredhead/lucid-kit";

// ── Demo wrapper ────────────────────────────────────────────────────

@Component({
  selector: "ui-story-designer-demo",
  standalone: true,
  imports: [UIFormDesigner, JsonPipe, UIButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="height: 700px">
      <ui-form-designer
        [schema]="initialSchema()"
        (schemaChange)="onSchemaChange($event)"
      />
    </div>

    @if (latestSchema()) {
      <div
        style="color: var(--ui-text, #1d232b); background: var(--ui-surface, #f7f8fa); margin-top: 16px; padding: 16px; border: 1px solid var(--ui-border, #d7dce2); border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px"
        >
          <h4 style="margin: 0; font-size: 0.875rem; font-weight: 700">
            Export
          </h4>
          <select
            style="color: var(--ui-text, #1d232b); background: var(--ui-surface, #ffffff); border: 1px solid var(--ui-border, #d7dce2); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem"
            (change)="onStrategyChange($event)"
          >
            @for (s of allStrategies; track s.label; let i = $index) {
              <option [value]="i">{{ s.label }}</option>
            }
          </select>
          <ui-button variant="outlined" size="small" (click)="onExport()">
            Export
          </ui-button>
        </div>
      </div>
    }

    @if (lastExport()) {
      <div
        style="color: var(--ui-text, #1d232b); background: var(--ui-surface-2, #f0f2f5); margin-top: 16px; padding: 16px; border: 1px solid var(--ui-border, #d7dce2); border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px"
        >
          <h4 style="margin: 0; font-size: 0.875rem; font-weight: 700; color: var(--ui-text, #1d232b)">
            Export Result
          </h4>
          <span
            style="color: var(--ui-text-muted, #5a6470); font-size: 0.75rem; font-family: monospace"
          >
            {{ lastExport()!.fileName }} ({{ lastExport()!.mimeType }})
          </span>
        </div>
        <pre
          style="color: var(--ui-text, #1d232b); background: var(--ui-surface, #fff); border: 1px solid var(--ui-border, #d7dce2); font-size: 0.75rem; margin: 0; padding: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-word; max-height: 400px; overflow: auto"
          >{{ lastExport()!.content }}</pre
        >
      </div>
    }
  `,
})
class StoryDesignerDemo {
  public readonly initialSchema = input<FormSchema | null>(null);

  protected readonly allStrategies: readonly ExportStrategy[] = [
    new JsonExportStrategy(),
    new AngularComponentExportStrategy(),
  ];

  protected readonly latestSchema = signal<FormSchema | null>(null);
  protected readonly lastExport = signal<ExportResult | null>(null);
  protected selectedStrategyIndex = 0;

  protected onSchemaChange(schema: FormSchema): void {
    this.latestSchema.set(schema);
  }

  protected onStrategyChange(event: Event): void {
    this.selectedStrategyIndex = Number(
      (event.target as HTMLSelectElement).value,
    );
  }

  protected onExport(): void {
    const schema = this.latestSchema();
    if (!schema) return;
    const strategy = this.allStrategies[this.selectedStrategyIndex];
    if (strategy) {
      this.lastExport.set(strategy.export(schema));
    }
  }
}

// ── Export preview wrapper ──────────────────────────────────────────

@Component({
  selector: "ui-story-export-preview",
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (result of results(); track result.fileName) {
      <div
        style="color: var(--ui-text, #1d232b); background: var(--ui-surface-2, #f0f2f5); margin-bottom: 16px; padding: 16px; border: 1px solid var(--ui-border, #d7dce2); border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px"
        >
          <h4 style="margin: 0; font-size: 0.875rem; font-weight: 700; color: var(--ui-text, #1d232b)">
            {{ result.fileName }}
          </h4>
          <span
            style="color: var(--ui-text-muted, #5a6470); font-size: 0.75rem; font-family: monospace"
          >
            {{ result.mimeType }}
          </span>
        </div>
        <pre
          style="color: var(--ui-text, #1d232b); background: var(--ui-surface, #fff); border: 1px solid var(--ui-border, #d7dce2); font-size: 0.75rem; margin: 0; padding: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-word; max-height: 600px; overflow: auto"
          >{{ result.content }}</pre
        >
      </div>
    }
  `,
})
class StoryExportPreview {
  public readonly schema = input.required<FormSchema>();

  private readonly strategies: readonly ExportStrategy[] = [
    new AngularComponentExportStrategy(),
    new JsonExportStrategy(),
  ];

  protected readonly results = computed(() =>
    this.strategies.map((s) => s.export(this.schema())),
  );
}

// ── Pre-built demo schema ───────────────────────────────────────────

const CONTACT_FORM_SCHEMA: FormSchema = {
  id: "contact",
  title: "Contact Form",
  description: "A simple contact form built in the designer",
  groups: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          validation: [
            { type: "required", message: "First name is required." },
          ],
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required", message: "Last name is required." }],
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          config: { type: "email" },
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Enter a valid e-mail address." },
          ],
        },
      ],
    },
    {
      id: "message",
      title: "Your Message",
      fields: [
        {
          id: "subject",
          title: "Subject",
          component: "select",
          options: [
            { label: "General inquiry", value: "general" },
            { label: "Support", value: "support" },
            { label: "Sales", value: "sales" },
          ],
          validation: [
            { type: "required", message: "Please select a subject." },
          ],
        },
        {
          id: "body",
          title: "Message",
          component: "text",
          config: { multiline: true, rows: 4 },
          validation: [
            { type: "required", message: "Message is required." },
            {
              type: "minLength",
              params: { min: 10 },
              message: "At least 10 characters.",
            },
          ],
        },
      ],
    },
  ],
};

// ── Meta ────────────────────────────────────────────────────────────

const meta: Meta<UIFormDesigner> = {
  title: "@theredhead/UI Forms/Form Designer",
  component: UIFormDesigner,
  tags: ["autodocs"],
  decorators: [
    applicationConfig({
      providers: [provideBuiltInFormFields()],
    }),
    moduleMetadata({
      imports: [StoryDesignerDemo, StoryExportPreview],
    }),
  ],
  argTypes: {
    schema: {
      description:
        "Optional initial `FormSchema` to load into the designer. " +
        "Pass an existing schema to resume editing.",
      control: { type: "object" },
      table: { category: "Inputs" },
    },
    schemaChange: {
      description:
        "Emits the current `FormSchema` whenever the user modifies the form. " +
        "Use two-way binding `[(schema)]` or listen via `(schemaChange)`.",
      action: "schemaChange",
      table: { category: "Outputs" },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**UIFormDesigner** — a visual form builder that produces a \`FormSchema\` JSON object.

### Features
- **Palette** — click field types to add them to the canvas
- **Canvas** — displays all groups and fields; supports reorder, duplicate, and delete
- **Inspector** — edit field ID, title, component type, validation rules, options, config, and more
- **Live Preview** — switch to the Preview tab to see the form rendered live
- **JSON View** — see the raw schema JSON in real time, with a copy-to-clipboard button
- **Import** — pass an existing \`FormSchema\` via the \`[schema]\` input to load it into the designer

### Inputs / Outputs
| Name | Type | Description |
|------|------|-------------|
| \`[schema]\` | \`FormSchema or null\` | Optional initial schema to pre-load |
| \`(schemaChange)\` | \`FormSchema\` | Emitted whenever the schema is modified |

### Layout
The designer uses a three-panel layout (palette / canvas / inspector) in design mode,
or a single panel in preview/JSON mode. It fills its container height.

### Export Strategies
Export strategies (\`JsonExportStrategy\`, \`AngularComponentExportStrategy\`) are available
programmatically via \`@theredhead/lucid-forms\` — see the **Export Preview** story.
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<UIFormDesigner>;

// ── Stories ─────────────────────────────────────────────────────────

export const EmptyDesigner: Story = {
  name: "Empty Designer",
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 700px">
        <ui-form-designer
          [schema]="schema"
          (schemaChange)="schemaChange($event)"
        />
      </div>
    `,
  }),
  args: {
    schema: null,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form-designer (schemaChange)="onSave($event)" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIFormDesigner],
  template: \\\`
    <div style="height: 700px">
      <ui-form-designer (schemaChange)="onSave($event)" />
    </div>
  \\\`,
})
export class ExampleComponent {
  onSave(schema: FormSchema): void {
    console.log('Exported schema:', schema);
  }
}

// ── SCSS ──
/* The designer fills its container height. Wrap in a sized container. */
`,
      },
    },
  },
};

export const WithExistingSchema: Story = {
  name: "Pre-loaded Schema",
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 700px">
        <ui-form-designer
          [schema]="schema"
          (schemaChange)="schemaChange($event)"
        />
      </div>
    `,
  }),
  args: {
    schema: CONTACT_FORM_SCHEMA as FormSchema,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form-designer
  [schema]="existingSchema"
  (schemaChange)="onSave($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [UIFormDesigner],
  template: \\\`
    <div style="height: 700px">
      <ui-form-designer
        [schema]="existingSchema"
        (schemaChange)="onSave($event)"
      />
    </div>
  \\\`,
})
export class ExampleComponent {
  existingSchema: FormSchema = {
    id: 'contact',
    title: 'Contact Form',
    groups: [
      {
        id: 'main',
        fields: [
          { id: 'name', title: 'Name', component: 'text' },
          { id: 'email', title: 'Email', component: 'text',
            config: { type: 'email' } },
        ],
      },
    ],
  };

  onSave(schema: FormSchema): void {
    console.log('Updated schema:', schema);
  }
}

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

export const ExportPreview: Story = {
  name: "Export Preview",
  render: () => ({
    props: { schema: CONTACT_FORM_SCHEMA },
    template: `<ui-story-export-preview [schema]="schema" />`,
  }),
  parameters: {
    docs: {
      source: {
        language: "typescript",
        code: `
// Use export strategies programmatically:
import { AngularComponentExportStrategy, JsonExportStrategy } from '@theredhead/lucid-forms';
import type { FormSchema, ExportResult } from '@theredhead/lucid-forms';

const schema: FormSchema = { /* your schema */ };
const strategy = new AngularComponentExportStrategy();
const result: ExportResult = strategy.export(schema);

console.log(result.fileName);  // "contact-form.component.ts"
console.log(result.content);   // Generated component source code
`,
      },
    },
  },
};

// ── Vehicle Registration demo schema ────────────────────────────────

const VEHICLE_REGISTRATION_SCHEMA: FormSchema = {
  id: "vehicle-registration",
  title: "Vehicle Registration",
  description:
    "Complete this form to register your vehicle with the Department of Motor Vehicles.",
  groups: [
    {
      id: "intro",
      title: "Welcome",
      fields: [
        {
          id: "intro-text",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<h3>Vehicle Registration Application</h3>" +
              "<p>Please complete all sections of this form accurately. " +
              "Fields marked with an asterisk are mandatory. You will need your " +
              "Vehicle Identification Number (VIN), proof of insurance, and a valid " +
              "form of identification to complete this registration.</p>" +
              "<p><strong>Processing time:</strong> 5\u201310 business days after submission.</p>",
          },
        },
        {
          id: "intro-image",
          title: "",
          component: "flair:image",
          config: {
            src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
            alt: "A vehicle on the road",
            width: 800,
            height: 240,
          },
        },
      ],
    },
    {
      id: "vehicle",
      title: "Vehicle Information",
      description: "Provide details about the vehicle you are registering.",
      fields: [
        {
          id: "make",
          title: "Make",
          component: "select",
          options: [
            { label: "Audi", value: "audi" },
            { label: "BMW", value: "bmw" },
            { label: "Chevrolet", value: "chevrolet" },
            { label: "Ford", value: "ford" },
            { label: "Honda", value: "honda" },
            { label: "Hyundai", value: "hyundai" },
            { label: "Mercedes-Benz", value: "mercedes" },
            { label: "Nissan", value: "nissan" },
            { label: "Tesla", value: "tesla" },
            { label: "Toyota", value: "toyota" },
            { label: "Volkswagen", value: "vw" },
          ],
          validation: [
            { type: "required", message: "Vehicle make is required." },
          ],
        },
        {
          id: "model",
          title: "Model",
          component: "text",
          validation: [
            { type: "required", message: "Vehicle model is required." },
          ],
        },
        {
          id: "year",
          title: "Model Year",
          component: "text",
          defaultValue: "2024",
          config: { type: "number" },
        },
        {
          id: "bodyType",
          title: "Body Type",
          component: "radio",
          options: [
            { label: "Sedan", value: "sedan" },
            { label: "SUV", value: "suv" },
            { label: "Truck", value: "truck" },
            { label: "Coupe", value: "coupe" },
            { label: "Hatchback", value: "hatchback" },
            { label: "Convertible", value: "convertible" },
            { label: "Van", value: "van" },
          ],
          validation: [
            { type: "required", message: "Please select a body type." },
          ],
        },
        {
          id: "color",
          title: "Exterior Color",
          component: "color",
          defaultValue: "#1a1a2e",
          config: { initialMode: "named", availableModes: ["named"] },
        },
        {
          id: "vin",
          title: "Vehicle Identification Number (VIN)",
          component: "text",
          description:
            "The 17-character VIN can be found on the dashboard or driver-side door jamb.",
          config: { textAdapter: "uppercase" },
          validation: [
            { type: "required", message: "VIN is required." },
            {
              type: "pattern",
              params: { pattern: "^[A-HJ-NPR-Z0-9]{17}$" },
              message:
                "VIN must be exactly 17 uppercase alphanumeric characters (no I, O, or Q).",
            },
          ],
        },
        {
          id: "mileage",
          title: "Current Odometer Reading (km)",
          component: "text",
          config: { type: "number" },
          validation: [
            { type: "required", message: "Odometer reading is required." },
          ],
        },
      ],
    },
    {
      id: "owner",
      title: "Owner Information",
      description: "Provide details about the registered owner of the vehicle.",
      fields: [
        {
          id: "salutation",
          title: "Title",
          component: "select",
          options: [
            { label: "Mr.", value: "mr" },
            { label: "Mrs.", value: "mrs" },
            { label: "Ms.", value: "ms" },
            { label: "Dr.", value: "dr" },
            { label: "Prof.", value: "prof" },
          ],
        },
        {
          id: "ownerFirstName",
          title: "First Name",
          component: "text",
          validation: [
            { type: "required", message: "First name is required." },
          ],
        },
        {
          id: "ownerLastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required", message: "Last name is required." }],
        },
        {
          id: "dateOfBirth",
          title: "Date of Birth",
          component: "date",
          validation: [
            { type: "required", message: "Date of birth is required." },
          ],
        },
        {
          id: "ownerEmail",
          title: "E-mail Address",
          component: "text",
          config: { type: "email" },
          description:
            "We will send your registration confirmation to this address.",
          validation: [
            { type: "required", message: "E-mail is required." },
            { type: "email", message: "Please enter a valid e-mail address." },
          ],
        },
        {
          id: "ownerPhone",
          title: "Phone Number",
          component: "text",
          config: { type: "tel" },
          validation: [
            { type: "required", message: "Phone number is required." },
          ],
        },
        {
          id: "ownerAddress",
          title: "Street Address",
          component: "text",
          config: { multiline: true, rows: 3 },
          validation: [
            { type: "required", message: "Address is required." },
            {
              type: "minLength",
              params: { min: 10 },
              message: "Please provide a complete street address.",
            },
          ],
        },
      ],
    },
    {
      id: "registration",
      title: "Registration Details",
      fields: [
        {
          id: "registrationType",
          title: "Registration Type",
          component: "select",
          options: [
            { label: "New Registration", value: "new" },
            { label: "Renewal", value: "renewal" },
            { label: "Transfer of Ownership", value: "transfer" },
            { label: "Replacement (Lost/Stolen)", value: "replacement" },
          ],
          validation: [
            { type: "required", message: "Please select a registration type." },
          ],
        },
        {
          id: "previousPlate",
          title: "Previous Licence Plate Number",
          component: "text",
          description: "Required for renewals and transfers.",
          visibleWhen: {
            field: "registrationType",
            operator: "in",
            value: ["renewal", "transfer"],
          },
          validation: [
            { type: "required", message: "Previous plate number is required." },
          ],
        },
        {
          id: "startDate",
          title: "Registration Start Date",
          component: "date",
          validation: [
            { type: "required", message: "Start date is required." },
          ],
        },
        {
          id: "durationMonths",
          title: "Registration Duration (months)",
          component: "slider",
          defaultValue: 12,
          config: { min: 6, max: 60, step: 6 },
        },
        {
          id: "hasInsurance",
          title: "I have valid vehicle insurance",
          component: "toggle",
          defaultValue: false,
        },
        {
          id: "insuranceCompany",
          title: "Insurance Company",
          component: "text",
          visibleWhen: {
            field: "hasInsurance",
            operator: "equals",
            value: true,
          },
          validation: [
            {
              type: "required",
              message: "Insurance company name is required.",
            },
          ],
        },
        {
          id: "insurancePolicyNo",
          title: "Policy Number",
          component: "text",
          visibleWhen: {
            field: "hasInsurance",
            operator: "equals",
            value: true,
          },
          validation: [
            { type: "required", message: "Policy number is required." },
          ],
        },
        {
          id: "vanityPlate",
          title: "Request a personalised plate",
          component: "toggle",
          defaultValue: false,
        },
        {
          id: "vanityPlateText",
          title: "Desired Plate Text",
          component: "text",
          description:
            "2\u20137 characters, letters and numbers only. Subject to availability.",
          visibleWhen: {
            field: "vanityPlate",
            operator: "equals",
            value: true,
          },
          validation: [
            {
              type: "required",
              message: "Please enter your desired plate text.",
            },
            {
              type: "pattern",
              params: { pattern: "^[A-Z0-9]{2,7}$" },
              message:
                "Plate text must be 2\u20137 uppercase letters or digits.",
            },
          ],
        },
      ],
    },
    {
      id: "documents",
      title: "Supporting Documents",
      fields: [
        {
          id: "docs-info",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<p>Upload scanned copies of the following documents:</p>" +
              "<ul>" +
              "<li>Proof of identity (passport or driving licence)</li>" +
              "<li>Proof of address (utility bill dated within the last 3 months)</li>" +
              "<li>Vehicle inspection certificate</li>" +
              "<li>Proof of insurance (if applicable)</li>" +
              "</ul>",
          },
        },
        {
          id: "documentUpload",
          title: "Upload Documents",
          component: "file",
          description: "Accepted formats: PDF, JPG, PNG. Max 10 MB per file.",
          config: { multiple: true },
        },
        {
          id: "additionalNotes",
          title: "Additional Notes",
          component: "richtext",
          description: "Any special circumstances or additional information.",
        },
      ],
    },
    {
      id: "consent",
      title: "Declaration & Consent",
      fields: [
        {
          id: "consent-notice",
          title: "",
          component: "flair:richtext",
          config: {
            content:
              "<p><em>By submitting this application, you declare that all information " +
              "provided is true and accurate to the best of your knowledge. False or " +
              "misleading information may result in the rejection of your application " +
              "and/or legal penalties.</em></p>",
          },
        },
        {
          id: "agreeTerms",
          title: "I agree to the terms and conditions",
          component: "checkbox",
          validation: [
            {
              type: "required",
              message: "You must agree to the terms to continue.",
            },
          ],
        },
        {
          id: "agreePrivacy",
          title: "I consent to the processing of my personal data",
          component: "checkbox",
          validation: [
            { type: "required", message: "Privacy consent is required." },
          ],
        },
        {
          id: "emailUpdates",
          title: "Send me registration status updates via e-mail",
          component: "toggle",
          defaultValue: true,
        },
      ],
    },
  ],
};

/**
 * A complex pre-loaded vehicle registration form showcasing flair elements
 * (rich text, image), conditional fields, diverse field types, validation,
 * and multiple groups \u2014 all editable in the designer.
 */
export const VehicleRegistration: Story = {
  name: "Vehicle Registration",
  render: (args) => ({
    props: args,
    template: `
      <ui-story-designer-demo [initialSchema]="schema" />
    `,
  }),
  args: {
    schema: VEHICLE_REGISTRATION_SCHEMA as FormSchema,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// \u2500\u2500 HTML \u2500\u2500
<ui-form-designer
  [schema]="vehicleSchema"
  (schemaChange)="onSave($event)"
/>

// \u2500\u2500 TypeScript \u2500\u2500
import { Component } from '@angular/core';
import { UIFormDesigner } from '@theredhead/lucid-forms';
import type { FormSchema } from '@theredhead/lucid-forms';

@Component({
  selector: 'app-vehicle-designer',
  standalone: true,
  imports: [UIFormDesigner],
  template: \\\`
    <div style="height: 700px">
      <ui-form-designer
        [schema]="vehicleSchema"
        (schemaChange)="onSave($event)"
      />
    </div>
  \\\`,
})
export class VehicleDesignerComponent {
  // Pre-loaded schema with flair elements, conditional fields,
  // and diverse field types.
  vehicleSchema: FormSchema = {
    id: 'vehicle-registration',
    title: 'Vehicle Registration',
    groups: [
      {
        id: 'intro',
        title: 'Welcome',
        fields: [
          { id: 'intro-text', title: '', component: 'flair:richtext',
            config: { content: '<h3>Vehicle Registration</h3><p>Fill out all sections.</p>' } },
          { id: 'intro-image', title: '', component: 'flair:image',
            config: { src: 'https://example.com/car.jpg', alt: 'Car', width: 800, height: 240 } },
        ],
      },
      {
        id: 'vehicle',
        title: 'Vehicle Info',
        fields: [
          { id: 'make', title: 'Make', component: 'select',
            options: [{ label: 'Ford', value: 'ford' }, { label: 'Toyota', value: 'toyota' }],
            validation: [{ type: 'required' }] },
          { id: 'vin', title: 'VIN', component: 'text',
            config: { textAdapter: 'uppercase' },
            validation: [{ type: 'required' },
              { type: 'pattern', params: { pattern: '^[A-HJ-NPR-Z0-9]{17}$' } }] },
          { id: 'color', title: 'Exterior Color', component: 'color', config: { initialMode: 'named', availableModes: ['named'] } },
        ],
      },
      // ... additional groups for owner, registration, documents, consent
    ],
  };

  onSave(schema: FormSchema): void {
    console.log('Updated schema:', schema);
  }
}

// \u2500\u2500 SCSS \u2500\u2500
/* No custom styles needed. */
`,
      },
    },
  },
};
