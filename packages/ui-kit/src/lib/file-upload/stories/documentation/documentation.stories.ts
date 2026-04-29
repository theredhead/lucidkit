import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/File Upload",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIFileUpload` provides a drag-and-drop zone with a click-to-browse fallback for selecting files. It supports file-type filtering, size limits, single or multi-file selection, and a two-way `files` model.",
      },
    },
  },
  argTypes: {
    accept: {
      control: "text",
      description:
        "Accepted file types (MIME or extension, e.g. `image/*`, `.pdf,.docx`).",
    },
    multiple: {
      control: "boolean",
      description: "Allow selecting multiple files.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the upload zone.",
    },
    label: {
      control: "text",
      description: "Label text displayed inside the drop zone.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for screen readers.",
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
          "- **Drag & drop** — visually highlights when files are dragged over the zone",
          "- **Click to browse** — a native file picker opens on click",
          "- **Accept filter** — restrict by MIME type (`image/*`) or extension (`.pdf,.docx`)",
          "- **Size limit** — reject files exceeding `maxFileSize` bytes",
          "- **Multi-file** — toggle `[multiple]` for batch uploads",
          "- **Events** — `fileAdded`, `fileRemoved`, `fileRejected` outputs for logging and feedback",
          "",
          "## Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `accept` | `string` | `"*"` | Accepted file types (MIME or extensions) |',
          "| `multiple` | `boolean` | `false` | Allow selecting multiple files |",
          "| `maxFileSize` | `number` | — | Maximum file size in bytes |",
          "| `disabled` | `boolean` | `false` | Disables the drop zone |",
          '| `label` | `string` | `"Drop files here…"` | Instruction text shown in the zone |',
          "",
          "## Model",
          "",
          "| Model | Type | Description |",
          "|-------|------|-------------|",
          "| `files` | `readonly UIFileEntry[]` | Two-way bound array of selected files |",
          "",
          "## Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `fileAdded` | `UIFileEntry` | Emitted when a file is accepted |",
          "| `fileRemoved` | `UIFileEntry` | Emitted when a file is removed from the list |",
          "| `fileRejected` | `{ file: File; reason: string }` | Emitted when a file is rejected (wrong type or too large) |",
          "",
          "**CSS custom properties** — inherited from `--ui-*` theme tokens:",
          "`--ui-border`, `--ui-accent`, `--ui-bg`, `--ui-surface`, `--ui-text`, `--ui-text-muted`",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
