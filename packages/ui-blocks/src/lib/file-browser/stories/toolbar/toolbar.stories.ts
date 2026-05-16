import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { ToolbarDemo } from "./toolbar.story";

const meta = {
  title: "@theredhead/UI Blocks/File Browser",
  tags: ["autodocs"],
  decorators: [moduleMetadata({ imports: [ToolbarDemo] })],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Toolbar: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          'When `[showToolbar]="true"` is set, a compact toolbar appears in the header bar. It provides:',
          "",
          "- **View-mode buttons** — List, Icons, Detail, Tree, Column (active button is highlighted)",
          "- **Details panel toggle** — shows/hides the metadata pane for the selected entry",
          "",
          "Both `viewMode` and `showDetails` are two-way bindable models:",
          "",
          "```html",
          "<ui-file-browser",
          '  [datasource]="ds"',
          '  [showToolbar]="true"',
          '  [(viewMode)]="currentMode"',
          '  [(showDetails)]="detailsOpen"',
          "/>",
          "```",
          "",
          "## Persistence",
          "",
          "User preferences (view mode, details panel state, panel widths) are persisted",
          "automatically via `StorageService` (defaults to `localStorage`).",
          "",
          "| Scenario | Behaviour |",
          "| --- | --- |",
          "| No `[name]` | Saved under the shared `__global__` key. All unnamed instances share these preferences. |",
          "| `[name]` provided | Saved under that key. Named settings are merged on top of global on load, so the more specific value wins. |",
          '| `[name]="UIFileBrowserKeys.OpenFile"` | Uses the built-in `open-file` key — shared across all open-file dialogs in the app. |',
          '| `[name]="UIFileBrowserKeys.SaveFile"` | Uses the built-in `save-file` key — shared across all save-file dialogs. |',
          "",
          "```ts",
          'import { UIFileBrowserKeys } from "@theredhead/lucid-blocks";',
          "",
          "// In your component:",
          "protected readonly Keys = UIFileBrowserKeys;",
          "```",
          "",
          "```html",
          "<!-- Open-file dialog remembers its own view mode -->",
          "<ui-file-browser",
          '  [datasource]="ds"',
          '  [showToolbar]="true"',
          '  [name]="Keys.OpenFile"',
          "/>",
          "",
          "<!-- Provide your own key to isolate a browser's preferences -->",
          "<ui-file-browser",
          '  [datasource]="ds"',
          '  [showToolbar]="true"',
          '  name="project-files"',
          "/>",
          "```",
          "",
          "The current **View mode** and **Details** state are echoed below the demo browser.",
        ].join("\n"),
      },
    },
  },
  render: () => ({
    template: "<ui-file-browser-toolbar-demo />",
  }),
};
