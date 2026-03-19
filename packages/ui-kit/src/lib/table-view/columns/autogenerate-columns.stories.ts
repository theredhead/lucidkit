import { Meta, StoryObj, moduleMetadata } from "@storybook/angular";
import { UITableView } from "../table-view.component";
import { UIAutogenerateColumnsDirective } from "./autogenerate-columns.directive";
import { Component, signal } from "@angular/core";
import { ArrayDatasource } from "../datasources/array-datasource";
import { DatasourceAdapter } from "../datasources/datasource-adapter";

@Component({
  selector: "ui-demo-autogenerate",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource"
      uiAutogenerateColumns
    ></ui-table-view>
  `,
})
class DemoAutogenerateComponent {
  public readonly datasource = new DatasourceAdapter(
    new ArrayDatasource([
      { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
      {
        id: 3,
        firstName: "Bob",
        lastName: "Johnson",
        email: "bob@example.com",
      },
      {
        id: 4,
        firstName: "Alice",
        lastName: "Williams",
        email: "alice@example.com",
      },
      {
        id: 5,
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@example.com",
      },
    ]),
  );
}

@Component({
  selector: "ui-demo-autogenerate-custom",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="config()"
    ></ui-table-view>
  `,
})
class DemoAutogenerateCustomComponent {
  public readonly datasource = new ArrayDatasource([
    {
      userId: 1,
      userName: "john_doe",
      userEmail: "john@example.com",
      createdAt: "2024-01-15",
    },
    {
      userId: 2,
      userName: "jane_smith",
      userEmail: "jane@example.com",
      createdAt: "2024-02-20",
    },
    {
      userId: 3,
      userName: "bob_johnson",
      userEmail: "bob@example.com",
      createdAt: "2024-03-10",
    },
  ]);

  public readonly config = signal({
    excludeKeys: ["userId"],
    headerMap: {
      userName: "Username",
      userEmail: "Email Address",
      createdAt: "Joined",
    },
  });
}

@Component({
  selector: "ui-demo-autogenerate-no-humanize",
  standalone: true,
  imports: [UITableView, UIAutogenerateColumnsDirective],
  template: `
    <ui-table-view
      [datasource]="datasource"
      [uiAutogenerateColumns]="{ humanizeHeaders: false }"
    ></ui-table-view>
  `,
})
class DemoAutogenerateNoHumanizeComponent {
  public readonly datasource = new ArrayDatasource([
    { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
  ]);
}

const meta: Meta<UITableView> = {
  title: "@Theredhead/UI Kit/Table View/Autogenerate Columns",
  component: UITableView,
  tags: ["autodocs"],
  decorators: [
    moduleMetadata({
      imports: [
        DemoAutogenerateComponent,
        DemoAutogenerateCustomComponent,
        DemoAutogenerateNoHumanizeComponent,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<UITableView>;

/**
 * Automatically generate table columns from the first row's properties.
 *
 * No need to manually declare each column — the directive introspects
 * the datasource and creates text columns with humanized headers.
 */
export const Autogenerate: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate></ui-demo-autogenerate>",
  }),
};

/**
 * Customize column generation with header mapping and excluded keys.
 *
 * Use `headerMap` to rename columns and `excludeKeys` to hide properties.
 */
export const AutogenerateCustom: Story = {
  render: (args) => ({
    props: args,
    template: "<ui-demo-autogenerate-custom></ui-demo-autogenerate-custom>",
  }),
};

/**
 * Disable header humanization to use property names as-is.
 */
export const AutogenerateNoHumanize: Story = {
  render: (args) => ({
    props: args,
    template:
      "<ui-demo-autogenerate-no-humanize></ui-demo-autogenerate-no-humanize>",
  }),
};
