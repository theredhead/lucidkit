import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIFormDesigner } from "../../form-designer.component";
import { StoryDesignerDemo } from "./vehicle-registration.story";

const meta = {
  title: "@theredhead/UI Forms/Form Designer",
  component: UIFormDesigner,
  tags: ["autodocs"],
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
  decorators: [moduleMetadata({ imports: [StoryDesignerDemo] })],
} satisfies Meta<UIFormDesigner>;

export default meta;
type Story = StoryObj<UIFormDesigner>;

export const VehicleRegistration: Story = {
  name: "Vehicle Registration",
  parameters: {
    docs: {},
  },
  render: () => ({
    template: "<ui-story-designer-demo />",
  }),
};
