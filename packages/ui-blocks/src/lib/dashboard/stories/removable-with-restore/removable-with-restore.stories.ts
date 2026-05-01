import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import type {
  DashboardColumns,
  DashboardDockPosition,
} from "../../dashboard.types";

import { DashboardRestoreDemo } from "./removable-with-restore.story";

interface DashboardRestoreStoryArgs {
  readonly columns: DashboardColumns;
  readonly gap: number;
  readonly dockPosition: DashboardDockPosition;
}

const meta = {
  title: "@theredhead/UI Blocks/Dashboard",
  component: DashboardRestoreDemo,
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
      options: ["top", "bottom"],
      description: "Position of the panel dock.",
    },
  },
  decorators: [moduleMetadata({ imports: [DashboardRestoreDemo] })],
} satisfies Meta<DashboardRestoreStoryArgs>;

export default meta;
type Story = StoryObj<DashboardRestoreStoryArgs>;

export const RemovableWithRestore: Story = {
  args: {
    columns: 3,
    gap: 16,
    dockPosition: "bottom",
  },
  parameters: {
    docs: {},
  },
  render: (args) => ({
    props: args,
    template:
      '<ui-dashboard-restore-demo [columns]="columns" [gap]="gap" [dockPosition]="dockPosition"></ui-dashboard-restore-demo>',
  }),
};
