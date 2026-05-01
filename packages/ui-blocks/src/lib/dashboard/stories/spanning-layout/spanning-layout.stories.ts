import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDashboard } from "../../dashboard.component";

import { DashboardSpanningDemo } from "./spanning-layout.story";

const meta = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: DashboardSpanningDemo,
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
  decorators: [moduleMetadata({ imports: [DashboardSpanningDemo] })]
} satisfies Meta<DashboardSpanningDemo>;

export default meta;
type Story = StoryObj<DashboardSpanningDemo>;

export const SpanningLayout: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-dashboard-spanning-demo />",
    })
};
