import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateCustomComponent } from "./autogenerate-custom.story";

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
  decorators: [moduleMetadata({ imports: [DemoAutogenerateCustomComponent] })]
} satisfies Meta<UITableView>;

export default meta;
type Story = StoryObj<UITableView>;

export const AutogenerateCustom: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-custom />",
    })
};
