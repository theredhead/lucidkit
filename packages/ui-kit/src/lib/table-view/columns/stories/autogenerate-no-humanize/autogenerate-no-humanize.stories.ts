import { moduleMetadata, type Meta, type StoryObj } from "@storybook/angular";

import { UITableView } from "../../../table-view.component";

import { DemoAutogenerateNoHumanizeComponent } from "./autogenerate-no-humanize.story";

const meta = {
  title: "@theredhead/UI Kit/Table View/Autogenerate Columns",
  component: DemoAutogenerateNoHumanizeComponent,
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
  decorators: [moduleMetadata({ imports: [DemoAutogenerateNoHumanizeComponent] })]
} satisfies Meta<DemoAutogenerateNoHumanizeComponent>;

export default meta;
type Story = StoryObj<DemoAutogenerateNoHumanizeComponent>;

export const AutogenerateNoHumanize: Story = {
  parameters: {
    docs: {}
  },
  render: () => ({
      template: "<ui-demo-autogenerate-no-humanize />",
    })
};
