import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UIDashboard } from "../../dashboard.component";

import { DashboardNotificationDemo } from "./notifications.story";

const meta = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: DashboardNotificationDemo,
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
  decorators: [moduleMetadata({ imports: [DashboardNotificationDemo] })]
} satisfies Meta<DashboardNotificationDemo>;

export default meta;
type Story = StoryObj<DashboardNotificationDemo>;

export const Notifications: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-dashboard-notification-demo />",
    })
};
