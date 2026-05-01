import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { WizardCustomLabelsStorySource } from "./wizard-custom-labels.story";

const meta = {
  title: "@theredhead/UI Forms/Form",
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
  \`@theredhead/lucid-kit\` field set, or supply your own mappings with
  \`provideFormFields()\`.`,
        },
      },
    },
  argTypes: {
    // ── UIForm inputs ──
    schema: {
      control: "select",
      options: ["contact", "conditional", "validation", "vehicle-registration"],
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
  decorators: [moduleMetadata({ imports: [WizardCustomLabelsStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const WizardCustomLabels: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-wizard-custom-labels-story-demo />",
    })
};
