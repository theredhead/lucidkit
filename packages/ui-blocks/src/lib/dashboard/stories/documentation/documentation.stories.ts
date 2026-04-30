import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDashboard } from "../../dashboard.component";

import { DocumentationStorySource } from "./documentation.story";

const meta = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: UIDashboard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`UIDashboard` is a CSS-grid\u2013based layout host for building " +
          "data dashboards. It renders projected `<ui-dashboard-panel>` " +
          "children in a responsive (or fixed-column) grid.",
      },
    },
  },
  argTypes: {
    columns: {
      control: "text",
      description:
        "Number of fixed columns or `'auto'` for responsive auto-fill.",
    },
    gap: {
      control: "number",
      description: "Gap between panels in pixels.",
    },
    dockPosition: {
      control: "select",
      options: ["bottom", "left", "right"],
      description: "Position of the panel dock.",
    },
  },
  decorators: [moduleMetadata({ imports: [DocumentationStorySource] })]
} satisfies Meta<UIDashboard>;

export default meta;
type Story = StoryObj<UIDashboard>;

export const Documentation: Story = {
  tags: ["!dev"],
  parameters: {
    docs: {
      description: {
        story: [
          "## Key Features",
          "",
          "- **Grid layout** — fixed column count or responsive `auto-fill`",
          "- **Panel spanning** — `colSpan` and `rowSpan` per panel",
          "- **Collapsible panels** — toggle panel body visibility",
          "- **Removable panels** — hide panels, restore via API",
          "- **Notifications** — `notify(timeoutMs?)` accent on panel + dock chip, auto-clears on expand or timeout",
          "- **Content-agnostic** — project any widget via `<ng-content>`",
          "- **Dark-mode ready** — three-tier CSS custom property theming",
          "- **Accessible** — `role=region`, `aria-label`, `aria-expanded`",
          "",
          "## Inputs (UIDashboard)",
          "",
          "| Input | Type | Default | Description |",
          "|-------|------|---------|-------------|",
          "| `columns` | `number \\| 'auto'` | `'auto'` | Grid column count |",
          "| `gap` | `number` | `16` | Gap between cells (px) |",
          "| `minColumnWidth` | `number` | `280` | Min column width for auto mode (px) |",
          '| `ariaLabel` | `string` | `"Dashboard"` | Accessible region label |',
          "",
          "## Inputs (UIDashboardPanel)",
          "",
          "| Input | Type | Description |",
          "|-------|------|-------------|",
          "| `config` | `DashboardPanelConfig` | Panel id, title, placement, flags |",
          "",
          "## Panel methods",
          "",
          "| Method | Description |",
          "|--------|-------------|",
          "| `notify(timeoutMs?: number)` | Activates notification accent. Clears on expand or after `timeoutMs` (0 = persist). |",
          "| `clearNotification()` | Manually clears the notification accent. |",
        ].join("\n")
      }
    }
  },
  render: () => ({ template: " " })
};
