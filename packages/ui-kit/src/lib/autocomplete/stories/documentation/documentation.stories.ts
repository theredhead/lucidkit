import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Autocomplete",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIAutocomplete` is a type-ahead search input that queries a pluggable datasource as the user types and presents matching suggestions in a dropdown panel.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input.",
    },
    minChars: {
      control: "number",
      description: "Minimum characters before querying the datasource.",
    },
    multiple: {
      control: "boolean",
      description: "Enable multi-select with chip tokens.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the autocomplete.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for the input.",
    },
  },
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Datasource-driven** — supply any object implementing `AutocompleteDatasource<T>` to control suggestions",
          "- **Single & multi-select** — toggle `[multiple]` to allow chip-based multi-selection",
          "- **Custom templates** — project an `<ng-template let-item>` to render rich suggestion rows",
          "- **Identity functions** — `displayWith` controls chip labels; `trackBy` provides stable identity for objects",
          "- **Accessible** — ARIA combobox + listbox roles, keyboard navigation, screen-reader announcements",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `datasource` | `AutocompleteDatasource<T>` | *(required)* | Provides suggestions for a given query string and current selection |",
          '| `placeholder` | `string` | `""` | Placeholder text shown when the input is empty |',
          "| `disabled` | `boolean` | `false` | Disables the input and hides the suggestion panel |",
          "| `multiple` | `boolean` | `false` | Enables multi-select mode with removable chips |",
          "| `minChars` | `number` | `1` | Minimum characters before the datasource is queried |",
          "| `displayWith` | `(item: T) => string` | `String()` | Formats an item for display in chips |",
          "| `trackBy` | `(item: T) => unknown` | identity | Returns a stable key for item comparison |",
          '| `ariaLabel` | `string` | `"Autocomplete"` | Accessible label forwarded to the native input |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `value` | `readonly T[]` | Two-way bound array of selected items |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `itemSelected` | `T` | Emitted when a suggestion is picked |",
          "| `itemRemoved` | `T` | Emitted when a chip is removed (multi-select) |",
          "",
          "## Datasource Interface",
          "",
          "```ts",
          "interface AutocompleteDatasource<T> {",
          "  completeFor(query: string, selection: readonly T[]): T[] | Observable<T[]>;",
          "}",
          "```",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
