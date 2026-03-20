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
  input,
  signal,
} from "@angular/core";

import { JsonPipe } from "@angular/common";

import { provideBuiltInFormFields } from "../../registry/built-in-fields";
import type { FormSchema } from "../../types/form-schema.types";
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
        (schemaChange)="onExport($event)"
      />
    </div>

    @if (exportedSchema()) {
      <div
        style="color: #1d232b; background: #f7f8fa; margin-top: 16px; padding: 16px; border: 1px solid #d7dce2; border-radius: 8px"
      >
        <h4
          style="color: #1d232b; margin: 0 0 8px; font-size: 0.875rem; font-weight: 700"
        >
          Exported Schema
        </h4>
        <pre
          style="color: #1d232b; font-size: 0.75rem; margin: 0; white-space: pre-wrap; word-break: break-word"
          >{{ exportedSchema() | json }}</pre
        >
      </div>
    }
  `,
})
class StoryDesignerDemo {
  public readonly initialSchema = input<FormSchema | null>(null);
  protected readonly exportedSchema = signal<FormSchema | null>(null);

  protected onExport(schema: FormSchema): void {
    this.exportedSchema.set(schema);
  }
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
          colSpan: 6,
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          validation: [{ type: "required", message: "Last name is required." }],
          colSpan: 6,
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
      imports: [StoryDesignerDemo],
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**UIFormDesigner** — a visual form builder that produces a \`FormSchema\` JSON object.

### Features
- **Palette** — drag or click field types to add them to the canvas
- **Canvas** — displays all groups and fields; supports reorder, duplicate, and delete
- **Inspector** — edit field ID, title, component type, validation rules, options, config, and more
- **Live Preview** — switch to the Preview tab to see the form rendered live
- **JSON View** — see the raw schema JSON in real time
- **Export** — click "Export Schema" to emit the schema via \`schemaChange\`
- **Import** — pass an existing \`FormSchema\` via the \`[schema]\` input to load it into the designer

### Layout
The designer uses a three-panel layout (palette | canvas | inspector) in design mode,
or a single panel in preview/JSON mode. It fills its container height.
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
  render: () => ({
    template: `<ui-story-designer-demo />`,
  }),
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
  render: () => ({
    props: { initialSchema: CONTACT_FORM_SCHEMA },
    template: `<ui-story-designer-demo [initialSchema]="initialSchema" />`,
  }),
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

// Give the StoryDesignerDemo an input for pre-loading
// (We use a simple property binding in the template above)
