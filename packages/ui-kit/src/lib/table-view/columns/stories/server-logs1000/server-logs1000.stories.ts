import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateLogsComponent } from "./server-logs1000.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: DemoAutogenerateLogsComponent,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A structural directive that automatically generates table columns " +
          "by introspecting the first row of a `UITableView` datasource.",
      },
    },
  },
  decorators: [moduleMetadata({ imports: [DemoAutogenerateLogsComponent] })]
} satisfies Meta<DemoAutogenerateLogsComponent>;

export default meta;
type Story = StoryObj<DemoAutogenerateLogsComponent>;

export const ServerLogs1000: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-logs />",
    })
};
