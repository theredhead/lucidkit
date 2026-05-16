import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { AllowedTypesHideDemo } from "./allowed-types-hide.story";

const meta = {
  title: "@theredhead/UI Blocks/File Browser/Allowed Types (hidden)",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: [
          "## Hide mode",
          "",
          'Set `[hideFiltered]="true"` to remove disallowed entries from the list entirely',
          "instead of graying them out. This is useful in open-file dialogs where showing",
          "unselectable files would only clutter the view.",
          "",
          "```html",
          "<ui-file-browser",
          '  [allowedTypes]="allowedTypes"',
          '  [hideFiltered]="true"',
          "/>",
          "```",
          "",
          "```ts",
          "import { parseAllowedTypes } from '@theredhead/lucid-blocks';",
          "",
          "protected readonly allowedTypes = parseAllowedTypes('image/*');",
          "```",
          "",
          "## MIME-type matching",
          "",
          "MIME rules (tokens containing `/`) match against the `mimeType` field on",
          "`FileBrowserEntry`. Extension rules (`.ext`) always match by filename regardless",
          "of whether `mimeType` is set.",
          "",
          "```ts",
          "const entry: FileBrowserEntry = {",
          "  id: 'hero',",
          "  name: 'hero.png',",
          "  isDirectory: false,",
          "  mimeType: 'image/png',   // ← used for MIME rules",
          "};",
          "```",
          "",
          "**Navigate into each folder** — `documents/` and `source/` contain a mix of images",
          "and other file types; only the images are shown because `hideFiltered` is on.",
        ].join("\n"),
      },
    },
  },
  decorators: [moduleMetadata({ imports: [AllowedTypesHideDemo] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AllowedTypesHide: Story = {
  name: "Allowed Types (hidden)",
  render: () => ({ template: "<ui-file-browser-allowed-types-hide-demo />" }),
};
