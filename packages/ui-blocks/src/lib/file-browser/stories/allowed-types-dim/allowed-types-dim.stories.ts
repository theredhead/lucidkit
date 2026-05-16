import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { AllowedTypesDimDemo } from "./allowed-types-dim.story";

const meta = {
  title: "@theredhead/UI Blocks/File Browser/Allowed Types (dim)",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "The `allowedTypes` input restricts which files are selectable in the browser.",
          "",
          "Pass a comma-separated string of type tokens — the same format used by the native",
          "HTML file-input `accept` attribute:",
          "",
          "```html",
          "<!-- native HTML reference (for context) -->",
          '<input type="file" accept=".ts,.html,image/*,application/json" />',
          "",
          "<!-- same string works directly on ui-file-browser -->",
          '<ui-file-browser allowedTypes=".ts,.html,image/*,application/json" />',
          "```",
          "",
          "| Token | Matches |",
          "|---|---|",
          "| `.ts` | Any file whose extension is `ts` (case-insensitive) |",
          "| `.html` | Any file whose extension is `html` |",
          "| `image/*` | Any file whose `mimeType` starts with `image/` |",
          "| `image/png` | Exact MIME type — only PNG images |",
          "| `application/json` | Exact MIME type match |",
          "",
          "You can also bind a pre-parsed `AllowedFileTypes` object instead of a string:",
          "```ts",
          "import { parseAllowedTypes } from '@theredhead/lucid-blocks';",
          "const types = parseAllowedTypes('.ts, .html, .scss');",
          "```",
          "```html",
          "<!-- string attribute (auto-parsed) -->",
          '<ui-file-browser allowedTypes=".ts,.html,.scss" />',
          "",
          "<!-- pre-parsed object -->",
          '<ui-file-browser [allowedTypes]="types" />',
          "```",
          "",
          "## Dim mode (default)",
          "",
          "When `hideFiltered` is `false` (the default), disallowed files remain visible but",
          "are grayed out (`opacity: 0.35`) and cannot be clicked or focused. This gives users",
          "a clear picture of what is in the directory while guiding them toward valid choices.",
          "",
          "**Navigate into `src/` to see the effect clearly** — the mixed folder contains",
          "`.ts`, `.html`, `.scss` files (selectable) alongside `.json`, `.md` and others",
          "(dimmed and non-interactive).",
        ].join("\n"),
      },
    },
  },
  decorators: [moduleMetadata({ imports: [AllowedTypesDimDemo] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllowedTypesDim: Story = {
  name: "Allowed Types (dim)",
  render: () => ({ template: "<ui-file-browser-allowed-types-dim-demo />" }),
};
