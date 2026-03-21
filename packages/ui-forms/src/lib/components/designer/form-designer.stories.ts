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

// ── Demo wrapper ────────────────────────────────────────────────────

@Component({
  selector: "ui-story-designer-demo",
  standalone: true,
  imports: [UIFormDesigner, JsonPipe],
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
        style="color: #1d232b; background: #f7f8fa; margin-top: 16px; padding: 16px; border: 1px solid #d7dce2; border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px"
        >
          <h4
            style="color: #1d232b; margin: 0; font-size: 0.875rem; font-weight: 700"
          >
            Export
          </h4>
          <select
            style="color: #1d232b; background: #ffffff; border: 1px solid #d7dce2; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem"
            (change)="onStrategyChange($event)"
          >
            @for (s of allStrategies; track s.label; let i = $index) {
              <option [value]="i">{{ s.label }}</option>
            }
          </select>
          <button
            type="button"
            style="color: #3584e4; background: transparent; border: 1px solid #3584e4; padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; cursor: pointer"
            (click)="onExport()"
          >
            Export
          </button>
        </div>
      </div>
    }

    @if (lastExport()) {
      <div
        style="color: #1d232b; background: #f0f4e8; margin-top: 16px; padding: 16px; border: 1px solid #b5c98a; border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px"
        >
          <h4
            style="color: #1d232b; margin: 0; font-size: 0.875rem; font-weight: 700"
          >
            Export Result
          </h4>
          <span
            style="color: #4a6620; font-size: 0.75rem; font-family: monospace"
          >
            {{ lastExport()!.fileName }} ({{ lastExport()!.mimeType }})
          </span>
        </div>
        <pre
          style="color: #1d232b; font-size: 0.75rem; margin: 0; white-space: pre-wrap; word-break: break-word; max-height: 400px; overflow: auto"
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
        style="color: #1d232b; background: #f0f4e8; margin-bottom: 16px; padding: 16px; border: 1px solid #b5c98a; border-radius: 8px"
      >
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px"
        >
          <h4
            style="color: #1d232b; margin: 0; font-size: 0.875rem; font-weight: 700"
          >
            {{ result.fileName }}
          </h4>
          <span
            style="color: #4a6620; font-size: 0.75rem; font-family: monospace"
          >
            {{ result.mimeType }}
          </span>
        </div>
        <pre
          style="color: #1d232b; background: #fafdf5; font-size: 0.75rem; margin: 0; padding: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-word; max-height: 600px; overflow: auto; border: 1px solid #d5e3b5"
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
  title: "@Theredhead/UI Forms/Form Designer",
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
programmatically via \`@theredhead/ui-forms\` — see the **Export Preview** story.
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
import { UIFormDesigner } from '@theredhead/ui-forms';
import type { FormSchema } from '@theredhead/ui-forms';

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
import { UIFormDesigner } from '@theredhead/ui-forms';
import type { FormSchema } from '@theredhead/ui-forms';

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
import { AngularComponentExportStrategy, JsonExportStrategy } from '@theredhead/ui-forms';
import type { FormSchema, ExportResult } from '@theredhead/ui-forms';

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
