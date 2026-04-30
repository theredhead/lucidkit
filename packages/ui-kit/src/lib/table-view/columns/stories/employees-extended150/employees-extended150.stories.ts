import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateEmployeesCityComponent } from "./employees-extended150.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: UITableView,
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
  decorators: [moduleMetadata({ imports: [DemoAutogenerateEmployeesCityComponent] })]
} satisfies Meta<UITableView>;

export default meta;
type Story = StoryObj<UITableView>;

export const EmployeesExtended150: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-employees-city />",
    })
};
