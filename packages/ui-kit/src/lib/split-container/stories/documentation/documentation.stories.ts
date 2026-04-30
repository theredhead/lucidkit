import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UISplitContainer } from "../../split-container.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Kit/Split Container",
  component: UISplitContainer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UISplitContainer` is a resizable N-panel layout. Place any number of `<ui-split-panel>` children inside — dividers are automatically inserted between adjacent panels. Each divider only ever adjusts its two immediately adjacent panels.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the panels.",
    },
    dividerWidth: {
      control: "number",
      description: "Width of the draggable divider in pixels.",
    },
    disabled: {
      control: "boolean",
      description: "Disables resizing.",
    },
    ariaLabel: {
      control: "text",
      description: "Accessible label for each resize handle.",
    },
  },
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UISplitContainer>;

export default meta;
type Story = StoryObj<UISplitContainer>;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **N-panel layout** — place any number of `<ui-split-panel>` children; dividers are inserted automatically",
          '- **Orientation** — `"horizontal"` or `"vertical"` (default: horizontal)',
          "- **Per-panel constraints** — set `[min]` and `[max]` pixel limits on each `<ui-split-panel>`",
          "- **Independent dividers** — each divider only adjusts its two immediately adjacent panels",
          "- **Double-click collapse** — double-click any divider to collapse the smaller adjacent panel",
          "- **Persistence** — give the container a `name` to save sizes in localStorage",
          "",
          "## Container Inputs",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          '| `orientation` | `string` | `"horizontal"` | Split direction |',
          "| `initialSizes` | `number[]` | equal split | Panel sizes as percentages |",
          "| `dividerWidth` | `number` | `6` | Divider thickness in pixels |",
          "| `name` | `string` | — | Key for localStorage persistence |",
          "| `disabled` | `boolean` | `false` | Disables resizing |",
          '| `ariaLabel` | `string` | `"Resize panels"` | Label for each divider |',
          "",
          "## Panel Inputs (`<ui-split-panel>`)",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `min` | `number` | — | Minimum panel size in pixels |",
          "| `max` | `number` | — | Maximum panel size in pixels |",
          "",
          "## Container Outputs",
          "",
          "| Output | Payload | Description |",
          "|--------|---------|-------------|",
          "| `resized` | `SplitResizeEvent` | Emitted after drag ends |",
          "| `resizing` | `SplitResizeEvent` | Emitted while dragging |",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
