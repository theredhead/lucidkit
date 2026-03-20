import { JsonPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from "@angular/core";
import {
  applicationConfig,
  moduleMetadata,
  type Meta,
  type StoryObj,
} from "@storybook/angular";

import { UIForm } from "./form.component";
import { UIFormWizard } from "./form-wizard.component";
import { FormEngine } from "../engine/form-engine";
import { provideBuiltInFormFields } from "../registry/built-in-fields";
import type { FormSchema, FormValues } from "../types/form-schema.types";

// ── Schemas ──────────────────────────────────────────────────────────

const contactSchema: FormSchema = {
  id: "contact",
  title: "Contact Form",
  description: "Fill in your details and we will get back to you.",
  groups: [
    {
      id: "personal",
      title: "Personal Information",
      fields: [
        {
          id: "firstName",
          title: "First Name",
          component: "text",
          colSpan: 6,
          validation: [{ type: "required" }],
        },
        {
          id: "lastName",
          title: "Last Name",
          component: "text",
          colSpan: 6,
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "E-mail",
          component: "text",
          description: "We'll never share your email with anyone.",
          validation: [{ type: "required" }, { type: "email" }],
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
          config: {
            options: [
              { label: "General inquiry", value: "general" },
              { label: "Bug report", value: "bug" },
              { label: "Feature request", value: "feature" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "body",
          title: "Message",
          component: "text",
          config: { multiline: true, rows: 4 },
          validation: [
            { type: "required" },
            { type: "minLength", params: { min: 10 } },
          ],
        },
      ],
    },
  ],
};

const conditionalSchema: FormSchema = {
  id: "conditional",
  title: "Conditional Fields Demo",
  description: "Fields appear and disappear based on your choices.",
  groups: [
    {
      id: "main",
      title: "Preferences",
      fields: [
        {
          id: "contactMethod",
          title: "Preferred Contact Method",
          component: "select",
          config: {
            options: [
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "Post", value: "post" },
            ],
          },
          validation: [{ type: "required" }],
        },
        {
          id: "emailAddress",
          title: "E-mail Address",
          component: "text",
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "email",
          },
          validation: [{ type: "required" }, { type: "email" }],
        },
        {
          id: "phone",
          title: "Phone Number",
          component: "text",
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "phone",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "address",
          title: "Postal Address",
          component: "text",
          visibleWhen: {
            field: "contactMethod",
            operator: "equals",
            value: "post",
          },
          validation: [{ type: "required" }],
        },
        {
          id: "newsletter",
          title: "Subscribe to newsletter",
          component: "toggle",
        },
        {
          id: "frequency",
          title: "Newsletter frequency",
          component: "select",
          visibleWhen: {
            field: "newsletter",
            operator: "equals",
            value: true,
          },
          config: {
            options: [
              { label: "Daily", value: "daily" },
              { label: "Weekly", value: "weekly" },
              { label: "Monthly", value: "monthly" },
            ],
          },
        },
      ],
    },
  ],
};

const wizardSchema: FormSchema = {
  id: "wizard",
  title: "Account Setup Wizard",
  description: "Complete all steps to create your account.",
  groups: [
    {
      id: "account",
      title: "Account",
      description: "Choose a username and password.",
      fields: [
        {
          id: "username",
          title: "Username",
          component: "text",
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 3 },
              message: "Username must be at least 3 characters.",
            },
          ],
        },
        {
          id: "password",
          title: "Password",
          component: "text",
          config: { type: "password" },
          validation: [
            { type: "required" },
            {
              type: "minLength",
              params: { min: 8 },
              message: "Password must be at least 8 characters.",
            },
          ],
        },
      ],
    },
    {
      id: "profile",
      title: "Profile",
      description: "Tell us about yourself.",
      fields: [
        {
          id: "displayName",
          title: "Display Name",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "favoriteColor",
          title: "Favorite Color",
          component: "color",
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure how you want to be notified.",
      fields: [
        {
          id: "emailNotifs",
          title: "Email notifications",
          component: "toggle",
          defaultValue: true,
        },
        {
          id: "pushNotifs",
          title: "Push notifications",
          component: "toggle",
        },
        {
          id: "digestFrequency",
          title: "Digest Frequency",
          component: "select",
          config: {
            options: [
              { label: "Real-time", value: "realtime" },
              { label: "Hourly", value: "hourly" },
              { label: "Daily", value: "daily" },
            ],
          },
          defaultValue: "daily",
        },
      ],
    },
  ],
};

const validationSchema: FormSchema = {
  id: "validation",
  title: "Validation Demo",
  description: "Try submitting with empty fields to see validation messages.",
  groups: [
    {
      id: "main",
      title: "All Validators",
      fields: [
        {
          id: "required",
          title: "Required Field",
          component: "text",
          validation: [{ type: "required" }],
        },
        {
          id: "email",
          title: "Email (with custom message)",
          component: "text",
          validation: [
            { type: "required" },
            {
              type: "email",
              message: "Please enter a valid email address.",
            },
          ],
        },
        {
          id: "minmax",
          title: "Text (3–20 chars)",
          component: "text",
          validation: [
            { type: "minLength", params: { min: 3 } },
            { type: "maxLength", params: { max: 20 } },
          ],
        },
        {
          id: "age",
          title: "Age (18–120)",
          component: "slider",
          defaultValue: 0,
          config: { min: 0, max: 150 },
          validation: [
            { type: "min", params: { min: 18 } },
            { type: "max", params: { max: 120 } },
          ],
        },
        {
          id: "pattern",
          title: "Uppercase only",
          component: "text",
          validation: [
            {
              type: "pattern",
              params: { pattern: "^[A-Z]+$" },
              message: "Only uppercase letters are allowed.",
            },
          ],
        },
      ],
    },
  ],
};

/** Lookup table for the Playground schema selector. */
const schemas: Record<string, FormSchema> = {
  contact: contactSchema,
  conditional: conditionalSchema,
  wizard: wizardSchema,
  validation: validationSchema,
};

// ── Demo wrapper components ──────────────────────────────────────────

@Component({
  selector: "ui-story-form-demo",
  standalone: true,
  imports: [JsonPipe, UIForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-form
      [engine]="engine()"
      [submitLabel]="submitLabel()"
      [showSubmit]="showSubmit()"
      (formSubmit)="onSubmit($event)"
    />

    <div class="live-panel">
      <h4 class="live-heading">
        Live output
        <span class="live-badge" [class.live-badge--valid]="engine().valid()">
          {{ engine().valid() ? "✓ valid" : "✗ invalid" }}
        </span>
      </h4>
      <pre class="live-json">{{ liveOutput() | json }}</pre>
    </div>

    @if (submitted()) {
      <h4 class="output-heading">Submitted values</h4>
      <pre class="output">{{ submitted() | json }}</pre>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 640px;
    }
    .live-panel {
      margin-top: 20px;
      border-top: 1px dashed rgba(128, 128, 128, 0.3);
      padding-top: 12px;
    }
    .live-heading {
      margin: 0 0 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .live-badge {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      padding: 1px 8px;
      border-radius: 10px;
      background: rgba(186, 26, 26, 0.15);
      color: #ba1a1a;
    }
    .live-badge--valid {
      background: rgba(56, 142, 60, 0.15);
      color: #388e3c;
    }
    .live-json {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.15);
      color: #90caf9;
      font-size: 0.8125rem;
      overflow: auto;
      max-height: 300px;
    }
    .output-heading {
      margin: 16px 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.5;
    }
    .output {
      margin-top: 4px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.3);
      color: #81c784;
      font-size: 0.8125rem;
      overflow: auto;
    }
  `,
})
class StoryFormDemo {
  public readonly engine = input.required<FormEngine>();
  public readonly submitLabel = input<string>("Submit");
  public readonly showSubmit = input<boolean>(true);
  public submitted = signal<FormValues | null>(null);

  public readonly liveOutput = computed(() => this.engine().output()());

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}

@Component({
  selector: "ui-story-wizard-demo",
  standalone: true,
  imports: [JsonPipe, UIFormWizard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-form-wizard
      [engine]="engine()"
      [nextLabel]="nextLabel()"
      [prevLabel]="prevLabel()"
      [submitLabel]="submitLabel()"
      (formSubmit)="onSubmit($event)"
    />

    <div class="live-panel">
      <h4 class="live-heading">
        Live output
        <span class="live-badge" [class.live-badge--valid]="engine().valid()">
          {{ engine().valid() ? "✓ valid" : "✗ invalid" }}
        </span>
      </h4>
      <pre class="live-json">{{ liveOutput() | json }}</pre>
    </div>

    @if (submitted()) {
      <h4 class="output-heading">Submitted values</h4>
      <pre class="output">{{ submitted() | json }}</pre>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 640px;
    }
    .live-panel {
      margin-top: 20px;
      border-top: 1px dashed rgba(128, 128, 128, 0.3);
      padding-top: 12px;
    }
    .live-heading {
      margin: 0 0 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .live-badge {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      padding: 1px 8px;
      border-radius: 10px;
      background: rgba(186, 26, 26, 0.15);
      color: #ba1a1a;
    }
    .live-badge--valid {
      background: rgba(56, 142, 60, 0.15);
      color: #388e3c;
    }
    .live-json {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.15);
      color: #90caf9;
      font-size: 0.8125rem;
      overflow: auto;
      max-height: 300px;
    }
    .output-heading {
      margin: 16px 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.5;
    }
    .output {
      margin-top: 4px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.3);
      color: #81c784;
      font-size: 0.8125rem;
      overflow: auto;
    }
  `,
})
class StoryWizardDemo {
  public readonly engine = input.required<FormEngine>();
  public readonly nextLabel = input<string>("Next");
  public readonly prevLabel = input<string>("Previous");
  public readonly submitLabel = input<string>("Submit");
  public submitted = signal<FormValues | null>(null);

  public readonly liveOutput = computed(() => this.engine().output()());

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}

/**
 * Playground wrapper — rebuilds the `FormEngine` reactively when
 * the schema selector changes and forwards all UIForm inputs.
 */
@Component({
  selector: "ui-story-playground",
  standalone: true,
  imports: [JsonPipe, UIForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ui-form
      [engine]="engine()"
      [submitLabel]="submitLabel()"
      [showSubmit]="showSubmit()"
      (formSubmit)="onSubmit($event)"
    />

    <div class="live-panel">
      <h4 class="live-heading">
        Live output
        <span class="live-badge" [class.live-badge--valid]="engine().valid()">
          {{ engine().valid() ? "✓ valid" : "✗ invalid" }}
        </span>
      </h4>
      <pre class="live-json">{{ liveOutput() | json }}</pre>
    </div>

    @if (submitted()) {
      <h4 class="output-heading">Submitted values</h4>
      <pre class="output">{{ submitted() | json }}</pre>
    }
  `,
  styles: `
    :host {
      display: block;
      max-width: 640px;
    }
    .live-panel {
      margin-top: 20px;
      border-top: 1px dashed rgba(128, 128, 128, 0.3);
      padding-top: 12px;
    }
    .live-heading {
      margin: 0 0 4px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.6;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .live-badge {
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      padding: 1px 8px;
      border-radius: 10px;
      background: rgba(186, 26, 26, 0.15);
      color: #ba1a1a;
    }
    .live-badge--valid {
      background: rgba(56, 142, 60, 0.15);
      color: #388e3c;
    }
    .live-json {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.15);
      color: #90caf9;
      font-size: 0.8125rem;
      overflow: auto;
      max-height: 300px;
    }
    .output-heading {
      margin: 16px 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.5;
    }
    .output {
      margin-top: 4px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.3);
      color: #81c784;
      font-size: 0.8125rem;
      overflow: auto;
    }
  `,
})
class StoryPlayground {
  public readonly schema = input<string>("contact");
  public readonly submitLabel = input<string>("Submit");
  public readonly showSubmit = input<boolean>(true);

  public readonly engine = computed(
    () => new FormEngine(schemas[this.schema()] ?? contactSchema),
  );

  public readonly liveOutput = computed(() => this.engine().output()());

  public submitted = signal<FormValues | null>(null);

  public constructor() {
    /* Reset submitted output when the schema changes. */
    effect(() => {
      this.schema();
      this.submitted.set(null);
    });
  }

  public onSubmit(values: FormValues): void {
    this.submitted.set(values);
  }
}

// ── Meta ─────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "@Theredhead/UI Forms/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `A **JSON-driven form engine** that renders fully functional forms
from a declarative schema. Forms support grouped fields, built-in and custom
validation, conditional visibility, multi-column layouts, and a wizard (step-by-step) mode.

The system consists of three layers:

1. **Schema** — a plain JSON object (\`FormSchema\`) that describes groups, fields,
   validation rules, and conditional logic.
2. **Engine** — \`FormEngine\` processes the schema into reactive signal-based state
   with live validation, touched tracking, and output computation.
3. **Rendering** — \`<ui-form>\` renders all groups sequentially; \`<ui-form-wizard>\`
   renders one group at a time with step navigation.

Field components are resolved at runtime through a DI-based **field registry**.
Call \`provideBuiltInFormFields()\` in your app config to register the default
\`@theredhead/ui-kit\` field set, or supply your own mappings with
\`provideFormFields()\`.`,
      },
    },
  },
  argTypes: {
    // ── UIForm inputs ──
    schema: {
      control: "select",
      options: ["contact", "conditional", "validation"],
      description:
        "The schema to render. In real usage you pass a `FormEngine` instance " +
        "constructed from a `FormSchema` object.",
      table: {
        category: "Inputs",
        defaultValue: { summary: '"contact"' },
      },
    },
    submitLabel: {
      control: "text",
      description: "Label for the built-in submit button.",
      table: {
        category: "Inputs",
        defaultValue: { summary: '"Submit"' },
      },
    },
    showSubmit: {
      control: "boolean",
      description:
        "Whether to render the built-in submit button. Set to `false` " +
        "when you provide your own submit UI.",
      table: {
        category: "Inputs",
        defaultValue: { summary: "true" },
      },
    },
    // ── UIForm outputs ──
    formSubmit: {
      description:
        "Emitted when the submit button is clicked and the form is valid. " +
        "Payload is a `FormValues` (key–value record of field IDs to values).",
      table: { category: "Outputs" },
    },
    // ── UIFormWizard inputs ──
    nextLabel: {
      control: "text",
      description: 'Label for the wizard "Next" button.',
      table: {
        category: "Wizard Inputs",
        defaultValue: { summary: '"Next"' },
      },
    },
    prevLabel: {
      control: "text",
      description: 'Label for the wizard "Previous" button.',
      table: {
        category: "Wizard Inputs",
        defaultValue: { summary: '"Previous"' },
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [provideBuiltInFormFields()],
    }),
    moduleMetadata({
      imports: [StoryFormDemo, StoryWizardDemo, StoryPlayground],
    }),
  ],
};
export default meta;

type Story = StoryObj;

// ── Stories ──────────────────────────────────────────────────────────

/**
 * **Interactive playground** — use the controls panel to switch between
 * schemas, customise the submit label, or hide the submit button entirely.
 * Fill in the form and click submit to see the output JSON.
 */
export const Playground: Story = {
  args: {
    schema: "contact",
    submitLabel: "Submit",
    showSubmit: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-story-playground
        [schema]="schema"
        [submitLabel]="submitLabel"
        [showSubmit]="showSubmit"
      />
    `,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form
  [engine]="engine"
  submitLabel="Send message"
  [showSubmit]="true"
  (formSubmit)="onSubmit($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/ui-forms';
import type { FormSchema, FormValues } from '@theredhead/ui-forms';

const schema: FormSchema = {
  id: 'contact',
  title: 'Contact Form',
  description: 'Fill in your details and we will get back to you.',
  groups: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: [
        { id: 'firstName', title: 'First Name', component: 'text', colSpan: 6,
          validation: [{ type: 'required' }] },
        { id: 'lastName', title: 'Last Name', component: 'text', colSpan: 6,
          validation: [{ type: 'required' }] },
        { id: 'email', title: 'E-mail', component: 'text',
          description: "We'll never share your email with anyone.",
          validation: [{ type: 'required' }, { type: 'email' }] },
      ],
    },
    {
      id: 'message',
      title: 'Your Message',
      fields: [
        { id: 'subject', title: 'Subject', component: 'select',
          config: { options: [
            { label: 'General inquiry', value: 'general' },
            { label: 'Bug report', value: 'bug' },
            { label: 'Feature request', value: 'feature' },
          ]},
          validation: [{ type: 'required' }] },
        { id: 'body', title: 'Message', component: 'text',
          config: { multiline: true, rows: 4 },
          validation: [{ type: 'required' }, { type: 'minLength', params: { min: 10 } }] },
      ],
    },
  ],
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UIForm],
  template: \`
    <ui-form
      [engine]="engine"
      submitLabel="Send message"
      (formSubmit)="onSubmit($event)"
    />
  \`,
})
export class ContactComponent {
  readonly engine = new FormEngine(schema);

  onSubmit(values: FormValues): void {
    console.log('Submitted:', values);
  }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]

// ── SCSS ──
/* No custom styles needed — form uses design tokens. */
`,
      },
    },
  },
};

/**
 * A realistic contact form with two groups, multi-column layout, a
 * `<textarea>` via the multiline config, and validation on every field.
 */
export const ContactForm: Story = {
  render: () => {
    const engine = new FormEngine(contactSchema);
    return {
      template: `<ui-story-form-demo [engine]="engine" submitLabel="Send message" />`,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form
  [engine]="engine"
  submitLabel="Send message"
  (formSubmit)="onSubmit($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/ui-forms';
import type { FormSchema, FormValues } from '@theredhead/ui-forms';

const schema: FormSchema = {
  id: 'contact',
  title: 'Contact Form',
  description: 'Fill in your details and we will get back to you.',
  groups: [
    {
      id: 'personal',
      title: 'Personal Information',
      fields: [
        { id: 'firstName', title: 'First Name', component: 'text', colSpan: 6,
          validation: [{ type: 'required' }] },
        { id: 'lastName', title: 'Last Name', component: 'text', colSpan: 6,
          validation: [{ type: 'required' }] },
        { id: 'email', title: 'E-mail', component: 'text',
          description: "We'll never share your email with anyone.",
          validation: [{ type: 'required' }, { type: 'email' }] },
      ],
    },
    {
      id: 'message',
      title: 'Your Message',
      fields: [
        { id: 'subject', title: 'Subject', component: 'select',
          config: { options: [
            { label: 'General inquiry', value: 'general' },
            { label: 'Bug report', value: 'bug' },
            { label: 'Feature request', value: 'feature' },
          ]},
          validation: [{ type: 'required' }] },
        { id: 'body', title: 'Message', component: 'text',
          config: { multiline: true, rows: 4 },
          validation: [{ type: 'required' }, { type: 'minLength', params: { min: 10 } }] },
      ],
    },
  ],
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [UIForm],
  template: \`
    <ui-form
      [engine]="engine"
      submitLabel="Send message"
      (formSubmit)="onSubmit($event)"
    />
  \`,
})
export class ContactComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Submitted:', values); }
}

// In app.config.ts — register the built-in field set:
// providers: [provideBuiltInFormFields()]

// ── SCSS ──
/* No custom styles needed — form uses design tokens. */
`,
      },
    },
  },
};

/**
 * Shows fields that appear or disappear based on the user's selections.
 * Choose a contact method to reveal the matching input. Toggle the
 * newsletter switch to show the frequency selector.
 */
export const ConditionalFields: Story = {
  render: () => {
    const engine = new FormEngine(conditionalSchema);
    return {
      template: `<ui-story-form-demo [engine]="engine" submitLabel="Save preferences" />`,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form [engine]="engine" (formSubmit)="onSubmit($event)" />

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/ui-forms';
import type { FormSchema, FormValues } from '@theredhead/ui-forms';

const schema: FormSchema = {
  id: 'conditional',
  title: 'Conditional Fields Demo',
  description: 'Fields appear and disappear based on your choices.',
  groups: [{
    id: 'main',
    title: 'Preferences',
    fields: [
      {
        id: 'contactMethod',
        title: 'Preferred Contact Method',
        component: 'select',
        config: { options: [
          { label: 'Email', value: 'email' },
          { label: 'Phone', value: 'phone' },
          { label: 'Post',  value: 'post'  },
        ]},
        validation: [{ type: 'required' }],
      },
      {
        id: 'emailAddress',
        title: 'E-mail Address',
        component: 'text',
        // Field is only visible when contactMethod === 'email'
        visibleWhen: { field: 'contactMethod', operator: 'equals', value: 'email' },
        validation: [{ type: 'required' }, { type: 'email' }],
      },
      {
        id: 'newsletter',
        title: 'Subscribe to newsletter',
        component: 'toggle',
      },
      {
        id: 'frequency',
        title: 'Newsletter frequency',
        component: 'select',
        visibleWhen: { field: 'newsletter', operator: 'equals', value: true },
        config: { options: [
          { label: 'Daily',   value: 'daily' },
          { label: 'Weekly',  value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
        ]},
      },
    ],
  }],
};

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [UIForm],
  template: \`
    <ui-form
      [engine]="engine"
      submitLabel="Save preferences"
      (formSubmit)="onSubmit($event)"
    />
  \`,
})
export class PreferencesComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Saved:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Multi-step wizard mode renders each group as a separate step with
 * Previous / Next / Submit navigation. Validation is enforced per-step —
 * the user cannot proceed until the current step is valid.
 */
export const WizardForm: Story = {
  render: () => {
    const engine = new FormEngine(wizardSchema);
    return {
      template: `<ui-story-wizard-demo [engine]="engine" />`,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form-wizard
  [engine]="engine"
  nextLabel="Continue"
  prevLabel="Go back"
  submitLabel="Create account"
  (formSubmit)="onSubmit($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIFormWizard, FormEngine, provideBuiltInFormFields } from '@theredhead/ui-forms';
import type { FormSchema, FormValues } from '@theredhead/ui-forms';

const schema: FormSchema = {
  id: 'wizard',
  title: 'Account Setup Wizard',
  description: 'Complete all steps to create your account.',
  groups: [
    {
      id: 'account',
      title: 'Account',
      description: 'Choose a username and password.',
      fields: [
        { id: 'username', title: 'Username', component: 'text',
          validation: [{ type: 'required' },
            { type: 'minLength', params: { min: 3 },
              message: 'Username must be at least 3 characters.' }] },
        { id: 'password', title: 'Password', component: 'text',
          config: { type: 'password' },
          validation: [{ type: 'required' },
            { type: 'minLength', params: { min: 8 },
              message: 'Password must be at least 8 characters.' }] },
      ],
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Tell us about yourself.',
      fields: [
        { id: 'displayName', title: 'Display Name', component: 'text',
          validation: [{ type: 'required' }] },
        { id: 'favoriteColor', title: 'Favorite Color', component: 'color' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure how you want to be notified.',
      fields: [
        { id: 'emailNotifs', title: 'Email notifications', component: 'toggle',
          defaultValue: true },
        { id: 'pushNotifs', title: 'Push notifications', component: 'toggle' },
        { id: 'digestFrequency', title: 'Digest Frequency', component: 'select',
          config: { options: [
            { label: 'Real-time', value: 'realtime' },
            { label: 'Hourly',    value: 'hourly' },
            { label: 'Daily',     value: 'daily' },
          ]},
          defaultValue: 'daily' },
      ],
    },
  ],
};

@Component({
  selector: 'app-account-setup',
  standalone: true,
  imports: [UIFormWizard],
  template: \`
    <ui-form-wizard
      [engine]="engine"
      nextLabel="Continue"
      prevLabel="Go back"
      submitLabel="Create account"
      (formSubmit)="onSubmit($event)"
    />
  \`,
})
export class AccountSetupComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Created:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]

// ── SCSS ──
/* No custom styles needed — wizard uses design tokens. */
`,
      },
    },
  },
};

/**
 * Showcases every built-in validator: **required**, **email**,
 * **minLength / maxLength**, **min / max** (numeric), and **pattern**.
 * Try submitting with empty or invalid values to see real-time error
 * messages appear beneath each field.
 */
export const ValidationDemo: Story = {
  render: () => {
    const engine = new FormEngine(validationSchema);
    return {
      template: `<ui-story-form-demo [engine]="engine" submitLabel="Validate & submit" />`,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form
  [engine]="engine"
  submitLabel="Validate & submit"
  (formSubmit)="onSubmit($event)"
/>

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIForm, FormEngine, provideBuiltInFormFields } from '@theredhead/ui-forms';
import type { FormSchema, FormValues } from '@theredhead/ui-forms';

// Validation rules live in the schema — no extra code needed.
const schema: FormSchema = {
  id: 'validation',
  title: 'Validation Demo',
  groups: [{
    id: 'main',
    title: 'All Validators',
    fields: [
      // Required
      { id: 'name', title: 'Required Field', component: 'text',
        validation: [{ type: 'required' }] },

      // Email (with custom error message)
      { id: 'email', title: 'Email', component: 'text',
        validation: [
          { type: 'required' },
          { type: 'email', message: 'Please enter a valid email address.' },
        ] },

      // String length bounds
      { id: 'bio', title: 'Bio (3–20 chars)', component: 'text',
        validation: [
          { type: 'minLength', params: { min: 3 } },
          { type: 'maxLength', params: { max: 20 } },
        ] },

      // Numeric bounds
      { id: 'age', title: 'Age (18–120)', component: 'slider',
        defaultValue: 0, config: { min: 0, max: 150 },
        validation: [
          { type: 'min', params: { min: 18 } },
          { type: 'max', params: { max: 120 } },
        ] },

      // Regex pattern
      { id: 'code', title: 'Uppercase only', component: 'text',
        validation: [{
          type: 'pattern', params: { pattern: '^[A-Z]+$' },
          message: 'Only uppercase letters are allowed.',
        }] },
    ],
  }],
};

@Component({
  selector: 'app-validation-demo',
  standalone: true,
  imports: [UIForm],
  template: \`
    <ui-form
      [engine]="engine"
      submitLabel="Validate & submit"
      (formSubmit)="onSubmit($event)"
    />
  \`,
})
export class ValidationDemoComponent {
  readonly engine = new FormEngine(schema);
  onSubmit(values: FormValues): void { console.log('Valid:', values); }
}

// In app.config.ts:
// providers: [provideBuiltInFormFields()]

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};

/**
 * Demonstrates the form without the built-in submit button — useful
 * when the form is embedded in a larger UI that has its own save action
 * (e.g. a dialog footer or toolbar).
 */
export const WithoutSubmitButton: Story = {
  render: () => {
    const engine = new FormEngine(contactSchema);
    return {
      template: `<ui-story-form-demo [engine]="engine" [showSubmit]="false" />`,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form
  [engine]="engine"
  [showSubmit]="false"
/>

<!-- You can read the values at any time via the engine: -->
<!-- engine.output()() returns the current FormValues -->
<!-- engine.valid() returns the current validation state -->

// ── TypeScript ──
import { Component } from '@angular/core';
import { UIForm, FormEngine } from '@theredhead/ui-forms';
import type { FormSchema } from '@theredhead/ui-forms';

@Component({
  selector: 'app-inline-form',
  standalone: true,
  imports: [UIForm],
  template: \`
    <ui-form [engine]="engine" [showSubmit]="false" />
    <footer>
      <button [disabled]="!engine.valid()" (click)="save()">
        Save changes
      </button>
    </footer>
  \`,
})
export class InlineFormComponent {
  readonly engine = new FormEngine(mySchema);

  save(): void {
    if (this.engine.valid()) {
      const values = this.engine.output()();
      console.log('Saving:', values);
    }
  }
}

// ── SCSS ──
/* Style the footer / button to match your own design. */
`,
      },
    },
  },
};

/**
 * The wizard variant with custom button labels — useful for
 * localisation or to match your application's terminology.
 */
export const WizardCustomLabels: Story = {
  render: () => {
    const engine = new FormEngine(wizardSchema);
    return {
      template: `
        <ui-story-wizard-demo
          [engine]="engine"
          nextLabel="Continue →"
          prevLabel="← Go back"
          submitLabel="Create account"
        />
      `,
      props: { engine },
    };
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `
// ── HTML ──
<ui-form-wizard
  [engine]="engine"
  nextLabel="Continue →"
  prevLabel="← Go back"
  submitLabel="Create account"
  (formSubmit)="onSubmit($event)"
/>

// ── TypeScript ──
import { UIFormWizard, FormEngine } from '@theredhead/ui-forms';

// Just set the label inputs — no extra code required.

// ── SCSS ──
/* No custom styles needed. */
`,
      },
    },
  },
};
