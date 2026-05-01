import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateEmployeesComponent } from "./employees200.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: DemoAutogenerateEmployeesComponent,
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
  decorators: [moduleMetadata({ imports: [DemoAutogenerateEmployeesComponent] })]
} satisfies Meta<DemoAutogenerateEmployeesComponent>;

export default meta;
type Story = StoryObj<DemoAutogenerateEmployeesComponent>;

export const Employees200: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-employees />",
    })
};
