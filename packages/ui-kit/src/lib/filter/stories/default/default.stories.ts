import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIFilterStoryDemo } from "./default.story";

const meta = {
  title: "@theredhead/UI Kit/Filter",
  component: UIFilterStoryDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIFilter` is a dynamic filter-builder component that lets users construct query predicates by selecting a **field**, an **operator**, and a **value** — similar to the filter UI found in spreadsheets or database query builders.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the filter UI.",
    },
    allowJunction: {
      control: "boolean",
      description: "Enable AND/OR junction between filter rows.",
    },
    allowSimple: {
      control: "boolean",
      description: "Allow the simple (single-field) filter mode.",
    },
    allowAdvanced: {
      control: "boolean",
      description: "Allow the advanced (multi-field) filter mode.",
    },
    modeLocked: {
      control: "boolean",
      description: "Lock the current filter mode (prevent switching).",
    },
    showSaveButton: {
      control: "boolean",
      description: "Show a Save button to persist the filter.",
    },
  },
  decorators: [moduleMetadata({ imports: [UIFilterStoryDemo] })]
} satisfies Meta;

export default meta;
type Story = StoryObj<UIFilterStoryDemo>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Field definitions** — pass an array of `FilterFieldDefinition` objects that describe available columns with their types (`string`, `number`, `date`)",
          "- **Smart operators** — operators are derived from the field type (e.g. `contains`, `startsWith` for strings; `greaterThan`, `lessThan` for numbers; `inTheLast` for dates)",
          "- **Junction toggle** — optionally allow users to switch between AND / OR conjunction via `[allowJunction]`",
          "- **Two-way binding** — the complete filter state is exposed as a `FilterDescriptor<T>` model for easy serialisation and restoration",
          "- **Pre-population** — set `value` to restore a previously saved filter",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `fields` | `FilterFieldDefinition<T>[]` | *(required)* | Defines the filterable columns with key, label, and type |",
          "| `allowJunction` | `boolean` | `false` | Shows an AND / OR toggle above the rule list |",
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `FilterDescriptor<T>` | Two-way bound descriptor containing junction mode and rule array |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `expressionChange` | `FilterExpression<T>` | Emits the serializable filter descriptor that can be passed directly to `FilterableArrayDatasource.filterBy()` |",
          "",
          "## FilterFieldDefinition",
          "",
          "```ts",
          "interface FilterFieldDefinition<T> {",
          "  key: keyof T;",
          "  label: string;",
          "  type: 'string' | 'number' | 'date';",
          "}",
          "```",
        ].join("\n")
      }
    }
  },
  render: () => ({
      template: "<ui-filter-story-demo />",
    })
};
