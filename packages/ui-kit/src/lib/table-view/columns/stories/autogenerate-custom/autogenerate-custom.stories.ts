import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateCustomComponent } from "./autogenerate-custom.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: DemoAutogenerateCustomComponent,
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
} satisfies Meta<DemoAutogenerateCustomComponent>;

export default meta;
type Story = StoryObj<DemoAutogenerateCustomComponent>;

export const AutogenerateCustom: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-custom />",
    })
};
