import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateFilteredComponent } from "./filtered-employees200.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: DemoAutogenerateFilteredComponent,
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
  decorators: [moduleMetadata({ imports: [DemoAutogenerateFilteredComponent] })]
} satisfies Meta<DemoAutogenerateFilteredComponent>;

export default meta;
type Story = StoryObj<DemoAutogenerateFilteredComponent>;

export const FilteredEmployees200: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-filtered />",
    })
};
